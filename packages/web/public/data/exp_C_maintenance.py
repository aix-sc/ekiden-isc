"""
ISC Experiment C (pilot, synthetic data): incremental maintenance vs. full re-SVD.

Tests hypothesis H2: event-driven incremental updates track the full-re-SVD
subspace at low cost, with maintenance cost that scales with CHANGE, not corpus
size N.  Also a small Procrustes "virtual axis update" demo (variant ii).

This is a SYNTHETIC pilot of the harness; the real-corpus run (embedding APIs,
Wikipedia revision stream) is the next step.  All numbers printed below are real
measurements from this run on synthetic data.
"""
import time, json, numpy as np
from scipy.linalg import subspace_angles, orthogonal_procrustes

rng = np.random.default_rng(7)

# ---------------- synthetic evolving corpus ----------------
D      = 256     # embedding dimension
R0     = 40      # true latent rank
K      = 32      # substrate rank (top-k semantic axes we maintain)
N0     = 3000    # initial corpus size
BATCH  = 120     # documents added per maintenance event (the "change" W per step)
STEPS  = 50      # number of update events

def latent_basis(t):
    """A latent basis that drifts slowly over time (the corpus evolves)."""
    B = rng.standard_normal((D, R0))
    # deterministic slow rotation seeded by t so the corpus shifts gradually
    rot = rng_t(t).standard_normal((R0, R0)) * 0.03
    B = B @ (np.eye(R0) + rot)
    q, _ = np.linalg.qr(B)
    return q  # D x R0 orthonormal-ish

def rng_t(t):
    return np.random.default_rng(1000 + t)

def make_docs(n, t):
    """n documents at time t: low-rank signal in a drifting basis + noise."""
    Bt = latent_basis(t)
    coeffs = rng.standard_normal((n, R0)) * (1.0 / (1 + np.arange(R0)) ** 0.5)
    signal = coeffs @ Bt.T
    noise = rng.standard_normal((n, D)) * 0.15
    return signal + noise

def topk_axes_full(X, k=K):
    """Full re-SVD: top-k right singular vectors (semantic axes). Cost ~ O(n d^2)."""
    # economy SVD; V rows are right singular vectors
    _, _, Vt = np.linalg.svd(X, full_matrices=False)
    return Vt[:k].T  # D x k

class IncrementalAxes:
    """Covariance-accumulation incremental maintainer.
    Per event: C += B^T B  (touches only the NEW batch, O(m d^2)), then eigh of
    the d x d covariance (O(d^3), independent of corpus size N). Cost scales with
    CHANGE, not N -- the property H2 predicts. (Brand-style rank-one updates are
    an even lighter O(d^2)/event alternative the full study will benchmark.)"""
    def __init__(self, d=D):
        self.C = np.zeros((d, d))
    def update(self, B):
        self.C += B.T @ B
    def axes(self, k=K):
        w, V = np.linalg.eigh(self.C)        # ascending
        return V[:, ::-1][:, :k]             # D x k, top-k

# fixed query set for retrieval quality
QUERIES = rng.standard_normal((200, D))

def recall_at_k(axes_a, axes_b, X, qk=10):
    """Recall@qk: do neighbors in substrate A match neighbors in substrate B?"""
    Za = X @ axes_a; Zb = X @ axes_b
    Qa = QUERIES @ axes_a; Qb = QUERIES @ axes_b
    def norm(M): return M / (np.linalg.norm(M, axis=1, keepdims=True) + 1e-12)
    Za, Zb, Qa, Qb = norm(Za), norm(Zb), norm(Qa), norm(Qb)
    na = (Qa @ Za.T).argsort(1)[:, ::-1][:, :qk]
    nb = (Qb @ Zb.T).argsort(1)[:, ::-1][:, :qk]
    return np.mean([len(set(a) & set(b)) / qk for a, b in zip(na, nb)])

def recon_err(X, axes):
    P = X @ axes
    return np.linalg.norm(X - P @ axes.T) / (np.linalg.norm(X) + 1e-12)

# ---------------- run the maintenance comparison ----------------
X = make_docs(N0, 0)
inc = IncrementalAxes()
inc.update(X)

rows = []
for t in range(1, STEPS + 1):
    B = make_docs(BATCH, t)
    X = np.vstack([X, B])

    t0 = time.perf_counter(); axes_full = topk_axes_full(X); t_full = time.perf_counter() - t0
    t0 = time.perf_counter(); inc.update(B); axes_inc = inc.axes(); t_inc = time.perf_counter() - t0

    ang = np.degrees(subspace_angles(axes_full, axes_inc).max())
    rec = recall_at_k(axes_inc, axes_full, X, qk=10)
    rows.append(dict(step=t, n=X.shape[0], t_full=t_full, t_inc=t_inc,
                     max_angle_deg=float(ang), recall10=float(rec),
                     err_full=recon_err(X, axes_full), err_inc=recon_err(X, axes_inc)))

import csv
with open("/home/claude/work/experiments/exp_C_results.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

last = rows[-1]
cum_full = sum(r["t_full"] for r in rows); cum_inc = sum(r["t_inc"] for r in rows)
summary = {
    "final_corpus_N": last["n"],
    "per_event_ms_full_final": round(last["t_full"] * 1e3, 2),
    "per_event_ms_incremental_final": round(last["t_inc"] * 1e3, 2),
    "per_event_speedup_final_x": round(last["t_full"] / last["t_inc"], 1),
    "cumulative_s_full": round(cum_full, 3),
    "cumulative_s_incremental": round(cum_inc, 3),
    "cumulative_speedup_x": round(cum_full / cum_inc, 1),
    "max_principal_angle_deg_over_run": round(max(r["max_angle_deg"] for r in rows), 3),
    "min_recall@10_over_run": round(min(r["recall10"] for r in rows), 3),
    "mean_recall@10": round(float(np.mean([r["recall10"] for r in rows])), 3),
}

# ---------------- Procrustes "virtual axis update" (variant ii) ----------------
# Two embedding spaces of the same corpus (a model-generation change): space2 is a
# rotated + noisy re-embedding of space1. Learn an orthogonal map from a small
# anchor set; map the rest WITHOUT re-embedding; measure recovered quality.
Xc = make_docs(4000, 0)
Q_true, _ = np.linalg.qr(rng.standard_normal((D, D)))     # the unknown generation change
space1 = Xc
space2 = Xc @ Q_true + rng.standard_normal(Xc.shape) * 0.05
proc = []
for k_anchor in [50, 100, 200, 400, 800]:
    idx = rng.choice(Xc.shape[0], k_anchor, replace=False)
    Omega, _ = orthogonal_procrustes(space1[idx], space2[idx])   # learn on anchors only
    mapped = space1 @ Omega                                       # map ALL without re-embedding
    # quality = cosine alignment of mapped vs truly re-embedded vectors
    cs = np.sum(_n(mapped) * _n(space2), axis=1) if False else None
    def _norm(M): return M / (np.linalg.norm(M, axis=1, keepdims=True) + 1e-12)
    cos = float(np.mean(np.sum(_norm(mapped) * _norm(space2), axis=1)))
    proc.append(dict(anchors=k_anchor, frac_reembedded=round(k_anchor / Xc.shape[0], 4),
                     mean_cosine_to_true=round(cos, 4)))

summary["procrustes_virtual_axis_update"] = proc

with open("/home/claude/work/experiments/exp_C_summary.json", "w") as f:
    json.dump(summary, f, indent=2)
print(json.dumps(summary, indent=2))

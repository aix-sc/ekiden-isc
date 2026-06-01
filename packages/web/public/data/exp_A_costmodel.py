"""
ISC Experiment A (cost-model harness). Computes C_QSR(R), C_ISC(R), and the
break-even read frequency R* from supplied cost constants, and plots the two
cost curves and their crossing point (the "measured Figure 2").

Plug MEASURED c-values (from running real QSR and ISC pipelines on a corpus)
into measure() to turn the illustrative crossing into a measured one.
"""
import numpy as np, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt

def break_even(N, W, cc, cm, cq, cr):
    """R* = (N*cc + W*cm) / (cq - cr). ISC wins above R* reads."""
    assert cq > cr, "reconstruction must cost more than traversal"
    return (N * cc + W * cm) / (cq - cr)

def amortised_isc(R, N, W, cc, cm, cr):
    return cr + (N * cc + W * cm) / R

def measure(label, N, W, cc, cm, cq, cr, Rmax=3e4, out=None):
    Rstar = break_even(N, W, cc, cm, cq, cr)
    R = np.linspace(1, Rmax, 500)
    Cqsr, Cisc = R * cq, N * cc + W * cm + R * cr
    print(f"[{label}] N={N:g} W={W:g} cc={cc} cm={cm} cq={cq} cr={cr}")
    print(f"  -> R* = {Rstar:,.0f} queries to break even; "
          f"ISC amortised/query -> {cr} as R grows ({cq/cr:.0f}x below QSR's {cq}).")
    if out:
        plt.figure(figsize=(6.4, 4.4), dpi=150)
        plt.plot(R, Cqsr, color="#C0392B", lw=2.4, label="QSR = R*c_q")
        plt.plot(R, Cisc, color="#1B998B", lw=2.4, label="ISC = N*c_c + W*c_m + R*c_r")
        plt.axvline(Rstar, color="#1F3A5F", ls="--")
        plt.xlabel("cumulative reads R"); plt.ylabel("total cost ($)")
        plt.legend(frameon=False); plt.grid(alpha=.25); plt.tight_layout()
        plt.savefig(out, dpi=150, facecolor="white"); print(f"  saved {out}")
    return Rstar

if __name__ == "__main__":
    # ILLUSTRATIVE constants (paper Section 4.2). Replace with measured values.
    measure("illustrative", N=1e6, W=1e4, cc=5e-4, cm=5e-4, cq=0.05, cr=2e-3,
            out="/home/claude/work/experiments/exp_A_costmodel.png")

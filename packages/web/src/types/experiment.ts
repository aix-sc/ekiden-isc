export interface ExperimentMeta {
  id: string
  name: string
  status: string
  purpose: string
  data: string
  evaluation: string
}

export interface ProcrustesPoint { anchors: number; frac_reembedded: number; mean_cosine_to_true: number }

export interface ExpCSummary {
  final_corpus_N: number
  per_event_speedup_final_x: number
  cumulative_speedup_x: number
  max_principal_angle_deg_over_run: number
  'mean_recall@10': number
  procrustes_virtual_axis_update: ProcrustesPoint[]
}

export interface CostRow { n: number; t_full: number; t_inc: number; max_angle_deg: number; recall10: number }

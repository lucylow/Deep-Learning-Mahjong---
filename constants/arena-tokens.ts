export const arenaTokens = {
  color: {
    ink: "#08080E",
    ivory: "#F5F0E8",
    jade: "#1A3A2F",
    jadeDeep: "#123C35",
    jadeSurface: "#17493F",
    brass: "#D4AF70",
    brassMuted: "#B87843",
    mist: "#C9D7CC",
    muted: "#C0BBA8",
    paper: "#F7F0E3",
    paperBorder: "#D7C8B2",
    successSurface: "#E8F1ED",
    errorSurface: "#FDE9E4",
  },
  radius: { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, section: 28 },
  type: { eyebrow: 10, body: 13, title: 18, hero: 24 },
  motion: { press: 80, card: 220, screen: 280 },
} as const;

export type ArenaTokens = typeof arenaTokens;

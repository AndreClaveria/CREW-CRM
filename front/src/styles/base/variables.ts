export const colors = {
  // Couleurs de base existantes
  white: "rgb(248,248,255)",
  black: "rgb(31,41,55)",
  text: "rgb(31,41,55)",
  textBlack: "rgb(248,248,255)",
  main: "rgb(31,41,55)",
  red: "rgb(216, 20, 20)",
  green: "rgb(21, 179, 81)",
  blue: "rgb(23, 89, 182)",

  // Nouvelles couleurs suggérées
  grey: {
    100: "rgb(249, 249, 249)", // background léger (summaryContainer)
    200: "rgb(240, 240, 240)", // background moyen (summaryContactItem)
    300: "rgb(224, 224, 224)", // stepperProgressBar
    400: "rgb(221, 221, 221)", // bordures
    500: "rgb(204, 204, 204)", // stepperCircle
    600: "rgb(102, 102, 102)", // texte secondaire (noContactsMessage)
  },
  warning: "rgb(255, 152, 0)", // maxContactsWarning
  error: {
    light: "rgb(255, 235, 238)", // errorMessage background
    dark: "rgb(216, 20, 20)", // même que red, pour cohérence
  },
  success: {
    light: "rgb(230, 247, 230)", // successMessage background
    dark: "rgb(21, 179, 81)", // même que green, pour cohérence
  },
  neutral: "rgb(245, 245, 245)", // cancelButton, prevButton

  // Couleurs spécifiques pour les tableaux
  table: {
    header: "rgb(240, 240, 245)", // En-tête de tableau
    headerText: "rgb(31, 41, 55)", // Texte d'en-tête
    border: "rgb(229, 231, 235)", // Bordures de cellules
    row: "rgb(255, 255, 255)", // Ligne normale
    rowAlt: "rgb(249, 250, 251)", // Ligne alternée
    rowHover: "rgb(243, 244, 246)", // Survol de ligne
    rowSelected: "rgb(236, 242, 255)", // Ligne sélectionnée
    text: "rgb(31, 41, 55)", // Texte normal dans les cellules
    accent: "rgb(23, 89, 182)", // Texte accentué/lien dans les cellules
    footer: "rgb(245, 245, 250)", // Pied de tableau
  },
};

export const gradients = {
  toRight: `linear-gradient(to right, ${colors.main}, ${colors.text})`,
  toBottom: `linear-gradients(to bottom, ${colors.main}, ${colors.text})`,
};

// Variantes pour le mode sombre (à utiliser dans le sélecteur [data-theme="dark"])
export const darkModeColors = {
  // Couleurs de base - garder le fond sombre et texte clair
  white: "rgb(31, 31, 41)", // Fond principal -> fond sombre
  black: "rgb(31, 31, 41)", // Texte sombre -> texte clair
  text: "rgb(240, 240, 245)", // Texte standard -> clair
  textBlack: "rgb(240, 240, 245)", // Texte sombre -> clair en mode sombre
  main: "rgb(31, 41, 55)", // La couleur principale reste inchangée

  // Couleurs d'accent restent les mêmes pour la cohérence
  red: "rgb(216, 20, 20)", // Rouge d'erreur
  green: "rgb(21, 179, 81)", // Vert de succès
  blue: "rgb(23, 89, 182)", // Bleu d'action

  // Palette de gris adaptée au mode sombre
  grey: {
    100: "rgb(42, 42, 52)", // Gris très sombre (fond de carte)
    200: "rgb(50, 50, 60)", // Gris sombre (éléments d'interface secondaires)
    300: "rgb(60, 60, 70)", // Gris moyen-sombre
    400: "rgb(80, 80, 95)", // Gris moyen (bordures)
    500: "rgb(100, 100, 120)", // Gris clair-sombre
    600: "rgb(170, 170, 190)", // Gris clair (texte secondaire)
  },

  // États et feedback
  warning: "rgb(255, 152, 0)", // Même couleur d'avertissement
  error: {
    light: "rgb(65, 25, 25)", // Fond d'erreur plus sombre
    dark: "rgb(216, 80, 80)", // Texte d'erreur plus visible
  },
  success: {
    light: "rgb(25, 65, 25)", // Fond de succès plus sombre
    dark: "rgb(80, 200, 120)", // Texte de succès plus visible
  },
  neutral: "rgb(245, 245, 245)", // Couleur neutre adaptée au mode sombre

  // Variantes pour les tableaux en mode sombre
  table: {
    header: "rgb(31, 41, 55)", // En-tête de tableau - même que main
    headerText: "rgb(240, 240, 245)", // Texte d'en-tête - blanc
    border: "rgb(60, 65, 75)", // Bordures de cellules
    row: "rgb(31, 31, 41)", // Ligne normale - même que white
    rowAlt: "rgb(38, 38, 48)", // Ligne alternée - légèrement plus claire
    rowHover: "rgb(45, 45, 55)", // Survol de ligne - encore plus claire
    rowSelected: "rgb(31, 51, 85)", // Ligne sélectionnée - teinte bleutée
    text: "rgb(240, 240, 245)", // Texte normal - blanc
    accent: "rgb(100, 150, 255)", // Texte accentué/lien - bleu plus clair
    footer: "rgb(31, 41, 55)", // Pied de tableau - même que main
  },
};

export const borders = {
  smallRadius: "4px",
  radius: "10px",
  bigRadius: "40px",
  circleRadius: "50%",
  width: "1px",
  bigWidth: "2px",
};

export const fonts = {
  first: '"Cinzel", serif',
  second: {
    thin: '"Lexend-Thin", sans-serif',
    extraLight: '"Lexend-ExtraLight", sans-serif',
    light: '"Lexend-Light", sans-serif',
    regular: '"Lexend-Regular", sans-serif',
    medium: '"Lexend-Medium", sans-serif',
    semiBold: '"Lexend-SemiBold", sans-serif',
    bold: '"Lexend-Bold", sans-serif',
    extraBold: '"Lexend-ExtraBold", sans-serif',
    black: '"Lexend-Black", sans-serif',
  },
};

export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const fontSizes = {
  smallSmall: "12px",
  small: "14px",
  normal: "16px",
  medium: "18px",
  big: "24px",
  title: "48px",
};

export const text = {
  indent: "40px",
  letterSpacing: "normal",
  lineHeight: "normal",
};

export const animations = {
  transition: "0.6s all",
  transitionTime: "0.6s",
  bigTransitionTime: "2.8s",
};

export const spacing = {
  small: "10px",
  normal: "20px",
  big: "40px",
};

export const opacity = {
  less: 0.6,
};

export const zIndex = {
  top: 100,
};

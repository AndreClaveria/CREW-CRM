import {
  colors,
  darkModeColors,
  gradients,
  borders,
  fonts,
  fontWeights,
  fontSizes,
  text,
  animations,
  spacing,
  opacity,
  zIndex,
} from "./variables";

export const globalStyles = `
  :root {
    /* Couleurs de base */
    --color-white: ${colors.white};
    --color-black: ${colors.black};
    --color-text: ${colors.text};
    --color-text-black: ${colors.textBlack};
    --color-main: ${colors.main};
    --color-red: ${colors.red};
    --color-green: ${colors.green};
    --color-blue: ${colors.blue};

    /* Palette de gris */
    --color-grey-100: ${colors.grey[100]};
    --color-grey-200: ${colors.grey[200]};
    --color-grey-300: ${colors.grey[300]};
    --color-grey-400: ${colors.grey[400]};
    --color-grey-500: ${colors.grey[500]};
    --color-grey-600: ${colors.grey[600]};
    
    /* États et feedback */
    --color-warning: ${colors.warning};
    --color-error-light: ${colors.error.light};
    --color-error-dark: ${colors.error.dark};
    --color-success-light: ${colors.success.light};
    --color-success-dark: ${colors.success.dark};
    --color-neutral: ${colors.neutral};
    
    /* Variables pour tableaux */
    --table-header-bg: ${colors.table.header};
    --table-header-text: ${colors.table.headerText};
    --table-border: ${colors.table.border};
    --table-row-bg: ${colors.table.row};
    --table-row-alt-bg: ${colors.table.rowAlt};
    --table-row-hover-bg: ${colors.table.rowHover};
    --table-row-selected-bg: ${colors.table.rowSelected};
    --table-text: ${colors.table.text};
    --table-accent: ${colors.table.accent};
    --table-footer-bg: ${colors.table.footer};

    /* Gradients */
    --gradient-to-right: ${gradients.toRight};
    --gradient-to-bottom: ${gradients.toBottom};
    
    /* Bordures */
    --border-small-radius: ${borders.smallRadius};
    --border-radius: ${borders.radius};
    --border-big-radius: ${borders.bigRadius};
    --border-circle-radius: ${borders.circleRadius};
    --border-width: ${borders.width};
    --border-big-width: ${borders.bigWidth};
    
    /* Typographie */
    --font-first: ${fonts.second.extraBold};
    --font-second-regular: ${fonts.second.regular};
    --font-second-bold: ${fonts.second.bold};
    
    --font-weight-regular: ${fontWeights.regular};
    --font-weight-medium: ${fontWeights.medium};
    --font-weight-bold: ${fontWeights.bold};
    
    --font-size-small-small: ${fontSizes.smallSmall};
    --font-size-small: ${fontSizes.small};
    --font-size-normal: ${fontSizes.normal};
    --font-size-medium: ${fontSizes.medium};
    --font-size-big: ${fontSizes.big};
    --font-size-title: ${fontSizes.title};
    
    /* Texte */
    --text-indent: ${text.indent};
    --text-letter-spacing: ${text.letterSpacing};
    --text-line-height: ${text.lineHeight};
    
    /* Animations */
    --animation-transition: ${animations.transition};
    --animation-transition-time: ${animations.transitionTime};
    --animation-big-transition-time: ${animations.bigTransitionTime};
    
    /* Espacements */
    --spacing-small: ${spacing.small};
    --spacing-normal: ${spacing.normal};
    --spacing-big: ${spacing.big};
    
    /* Opacité */
    --opacity-less: ${opacity.less};
    
    /* Z-index */
    --z-index-top: ${zIndex.top};
  }

  /* Mode sombre */
  [data-theme="dark"] {
    /* Couleurs de base */
    --color-white: ${darkModeColors.white};
    --color-black: ${darkModeColors.black};
    --color-text: ${darkModeColors.text};
    --color-main: ${darkModeColors.main};

    /* Palette de gris */
    --color-grey-100: ${darkModeColors.grey[100]};
    --color-grey-200: ${darkModeColors.grey[200]};
    --color-grey-300: ${darkModeColors.grey[300]};
    --color-grey-400: ${darkModeColors.grey[400]};
    --color-grey-500: ${darkModeColors.grey[500]};
    --color-grey-600: ${darkModeColors.grey[600]};
    
    /* Couleur neutre */
    --color-neutral: ${darkModeColors.neutral};
    
    /* Variables pour tableaux */
    --table-header-bg: ${darkModeColors.table.header};
    --table-header-text: ${darkModeColors.table.headerText};
    --table-border: ${darkModeColors.table.border};
    --table-row-bg: ${darkModeColors.table.row};
    --table-row-alt-bg: ${darkModeColors.table.rowAlt};
    --table-row-hover-bg: ${darkModeColors.table.rowHover};
    --table-row-selected-bg: ${darkModeColors.table.rowSelected};
    --table-text: ${darkModeColors.table.text};
    --table-accent: ${darkModeColors.table.accent};
    --table-footer-bg: ${darkModeColors.table.footer};

    /* Mise à jour des gradients pour le mode sombre */
    --gradient-to-right: linear-gradient(to right, ${darkModeColors.main}, ${darkModeColors.text});
    --gradient-to-bottom: linear-gradient(to bottom, ${darkModeColors.main}, ${darkModeColors.text});
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    overflow: hidden;
    font-family: var(--font-second-regular);
    font-size: var(--font-size-normal);
    color: var(--color-text);
    background-color: var(--color-white);
    line-height: var(--text-line-height);
    transition: background-color var(--animation-transition-time), color var(--animation-transition-time);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: var(--animation-transition);
  }

  a:focus {
    outline: var(--border-width) solid var(--color-main);
    outline-offset: 2px;
  }

  h1, h2 {
    font-family: var(--font-first);
    font-weight: var(--font-weight-bold);
  }

  h1 {
    font-size: var(--font-size-title);
    margin-bottom: var(--spacing-normal);
  }

  h2 {
    font-size: var(--font-size-big);
    margin-bottom: var(--spacing-small);
  }

  button, input, select, textarea {
    font-family: var(--font-second-regular);
    font-size: var(--font-size-normal);
  }

  /* Styles pour les tableaux */
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: var(--spacing-normal);
    font-size: var(--font-size-normal);
  }

  thead th {
    background-color: var(--table-header-bg);
    color: var(--table-header-text);
    font-weight: var(--font-weight-medium);
    text-align: left;
    padding: var(--spacing-small);
    border-bottom: var(--border-width) solid var(--table-border);
    transition: background-color var(--animation-transition-time), color var(--animation-transition-time);
  }

  tbody tr {
    background-color: var(--table-row-bg);
    transition: background-color var(--animation-transition-time);
  }

  tbody tr:nth-child(even) {
    background-color: var(--table-row-alt-bg);
  }

  tbody tr:hover {
    background-color: var(--table-row-hover-bg);
  }

  tbody tr.selected {
    background-color: var(--table-row-selected-bg);
  }

  td, th {
    padding: var(--spacing-small);
    border-bottom: var(--border-width) solid var(--table-border);
    color: var(--table-text);
    transition: border-color var(--animation-transition-time), color var(--animation-transition-time);
  }

  td a {
    color: var(--table-accent);
  }

  tfoot tr {
    background-color: var(--table-footer-bg);
    font-weight: var(--font-weight-medium);
    transition: background-color var(--animation-transition-time);
  }

  /* Styles pour les tables avec fonctionnalités avancées */
  table.interactive {
    position: relative;
  }

  table.interactive thead th {
    cursor: pointer;
    user-select: none;
  }

  table.interactive thead th:hover {
    background-color: var(--table-row-hover-bg);
  }

  table.interactive tbody tr {
    cursor: pointer;
  }

  table.compact td, 
  table.compact th {
    padding: calc(var(--spacing-small) / 2);
    font-size: var(--font-size-small);
  }

  table.bordered {
    border: var(--border-width) solid var(--table-border);
  }

  table.bordered td, 
  table.bordered th {
    border: var(--border-width) solid var(--table-border);
  }

  /* Styles pour la pagination des tableaux */
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--spacing-small);
    background-color: var(--table-footer-bg);
    border: var(--border-width) solid var(--table-border);
    border-top: none;
    transition: background-color var(--animation-transition-time), border-color var(--animation-transition-time);
  }

  .table-pagination button {
    background-color: var(--color-white);
    border: var(--border-width) solid var(--table-border);
    border-radius: var(--border-small-radius);
    padding: calc(var(--spacing-small) / 2) var(--spacing-small);
    margin: 0 calc(var(--spacing-small) / 4);
    cursor: pointer;
    transition: background-color var(--animation-transition-time), border-color var(--animation-transition-time);
  }

  .table-pagination button:hover {
    background-color: var(--table-row-hover-bg);
  }

  .table-pagination button.active {
    background-color: var(--table-accent);
    color: var(--color-white);
    border-color: var(--table-accent);
  }

  .table-pagination .pagination-info {
    margin-right: var(--spacing-small);
    color: var(--table-text);
  }
  
  /* Styles pour les tableaux responsifs */
   @media (maxWidth: 768px) {
    .table-responsive {
      display: block;
      width: 100%;
      overflow-x: auto;
    }
    
    .table-responsive thead {
      display: none;
    }
    
    .table-responsive tbody tr {
      display: block;
      margin-bottom: var(--spacing-normal);
      border: var(--border-width) solid var(--table-border);
    }
    
    .table-responsive td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: var(--border-width) solid var(--table-border);
      padding: var(--spacing-small);
    }
    
    .table-responsive td:before {
      content: attr(data-label);
      font-weight: var(--font-weight-bold);
      padding-right: var(--spacing-small);
    }
  }
`;

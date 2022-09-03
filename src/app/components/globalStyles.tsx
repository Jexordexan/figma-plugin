import { globalCss } from '@/stitches.config';

export const globalStyles = globalCss({
  body: {
    fontFamily: '$sans',
    fontSize: '$small',
    letterSpacing: '0',
    color: '$fgDefault',
  },
  'button[disabled]': {
    opacity: 0.5,
  },
  'button:focus': {
    outline: 'none',
    boxShadow: '0 0 0 4px $bgAccent',
  },
  '.scroll-container': {
    overflowY: 'scroll',
  },
  '.content::-webkit-scrollbar, .ReactModal__Content::-webkit-scrollbar,  textarea::-webkit-scrollbar': {
    width: '9px',
  },
  '.overflow-x-auto::-webkit-scrollbar': {
    height: '9px',
  },
  '.content::-webkit-scrollbar-thumb, .overflow-x-auto::-webkit-scrollbar-thumb, .ReactModal__Content::-webkit-scrollbar-thumb, textarea::-webkit-scrollbar-thumb': {
    backgroundColor: '$borderMuted',
    borderRadius: '9px',
    border: '2px solid var(--figma-color-bg)',
  },
  '.content-dark::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--colors-contextMenuForegroundMuted, #000) !important',
    borderColor: 'var(--colors-contextMenuBackground, #333) !important',
    borderRadius: '9px',
    border: '2px solid',
  },
  '#corner': {
    position: 'fixed',
    right: 0,
    bottom: 0,
    cursor: 'nwse-resize',
  },
  '.color-picker .react-colorful': {
    width: '100%',
  },
  '.color-picker .react-colorful__saturation': {
    borderRadius: '$default',
  },

  '.color-picker .react-colorful__hue, .color-picker .react-colorful__alpha': {
    height: '$4',
    borderRadius: '$default',
  },

  '.color-picker .react-colorful__hue-pointer, .color-picker .react-colorful__alpha-pointer': {
    height: '$4',
    width: '$4',
  },

  '.color-picker .react-colorful__hue': {
    marginTop: '$3',
    marginBottom: '$2',
  },

  '.color-picker .react-colorful__alpha': {
    marginTop: '$2',
    marginBottom: '$3',
  },

});

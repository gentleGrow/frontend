const prettierConfig = {
  semi: true, // 세미콜론 사용
  singleQuote: true, // 작은 따옴표 사용
  trailingComma: 'none', // 여러 줄을 사용할 때, 후행 콤마 사용안함
  tabWidth: 2, // 탭 간격은 2
  printWidth: 120, // 줄 바꿈 할 폭 길이
  bracketSpacing: true,
  endOfLine: 'auto',
  useTabs: false,
};

module.exports = prettierConfig;

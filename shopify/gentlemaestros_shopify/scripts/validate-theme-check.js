const { spawnSync } = require('child_process');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const shopifyBin = path.join(themeRoot, 'node_modules', '.bin', 'shopify');

const result = spawnSync(
  shopifyBin,
  ['theme', 'check', '--output', 'json', '--path', themeRoot],
  { cwd: themeRoot, encoding: 'utf8' }
);

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.error) {
  console.error(`Unable to run Shopify Theme Check: ${result.error.message}`);
  process.exit(1);
}

const stdout = (result.stdout || '').trim();
let reports;

try {
  reports = stdout ? JSON.parse(stdout) : [];
} catch (error) {
  process.stdout.write(result.stdout);
  console.error('Unable to parse Shopify Theme Check JSON output.');
  process.exit(result.status || 1);
}

const legacyParserAllowlist = [
  'sections/page-wishlist.liquid',
  'sections/section-banner-v3.liquid',
  'snippets/product-details-large-image.liquid',
  'snippets/product-details-sidebar.liquid',
  'snippets/product-details-sidebar2.liquid',
  'snippets/product-details-sticky-center.liquid',
  'snippets/product-details-sticky.liquid',
  'snippets/product-extended.liquid',
  'snippets/product-gallery-basic.liquid',
  'snippets/product-slide-center.liquid',
  'snippets/product-slide-gallery.liquid',
  'templates/customers/login.liquid',
  'templates/customers/register.liquid'
];

const isAllowedLegacyParserError = (reportPath, offense) =>
  offense.check === 'LiquidHTMLSyntaxError' &&
  legacyParserAllowlist.some((allowedPath) => reportPath.endsWith(allowedPath));

const errors = reports.flatMap((report) =>
  (report.offenses || [])
    .filter(
      (offense) =>
        offense.severity === 'error' &&
        !isAllowedLegacyParserError(report.path, offense)
    )
    .map((offense) => ({
      path: report.path,
      check: offense.check,
      row: offense.start_row,
      column: offense.start_column,
      message: offense.message
    }))
);

if (errors.length > 0) {
  console.error(`Theme Check found ${errors.length} blocking error(s):`);
  for (const error of errors) {
    console.error(
      `- ${error.path}:${error.row}:${error.column} ${error.check}: ${error.message}`
    );
  }
  process.exit(1);
}

const warningCount = reports.reduce(
  (total, report) => total + (report.warningCount || 0),
  0
);

console.log(`Theme Check passed with 0 blocking errors and ${warningCount} warning(s).`);

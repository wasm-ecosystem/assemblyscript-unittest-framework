import { CodeCoverage, FileCoverageResult, UncoveredLines, OrganizationName, Repository } from "../../interface.js";
import { escape } from "../../utils/escape.js";

function generateLineCount(totalLines: number): string {
  const str: string[] = [];
  for (let line = 0; line < totalLines; line++) {
    str.push(`<a name='L${line}'></a><a href='#L${line}'>${line}</a>`);
  }
  return str.join("\n");
}

function generateLineCoverage(codes: CodeCoverage[]): string {
  const str: string[] = [];
  for (const code of codes) {
    if (code.usedCount === CodeCoverage.default) {
      str.push(`<span class="cline-any cline-neutral">&nbsp;</span>`);
    } else if (code.usedCount === 0) {
      str.push(`<span class="cline-any cline-no">${code.usedCount}x</span>`);
    } else {
      str.push(`<span class="cline-any cline-yes">${code.usedCount}x</span>`);
    }
  }
  return str.join("\n");
}

function generateSource(codes: CodeCoverage[], uncoveredlines: UncoveredLines): string {
  const str: string[] = [];
  for (const [index, code] of codes.entries()) {
    if (uncoveredlines.has(index + 1)) {
      // IMPORTANT! to add "nocode" here to preventing prettify from adding unwanted pln class
      str.push('<span class="missing-if-branch nocode" title="Branch not taken">!</span>' + escape(code.source));
    } else {
      str.push(escape(code.source));
    }
  }
  return str.join("\n");
}

export function generateCodeHtml(relativePathofRoot: string, result: FileCoverageResult): string {
  const codes = result.sourceUsedCount;

  const lineCoutHtml = generateLineCount(codes.length);
  const lineCov = generateLineCoverage(codes);
  const lineSource = generateSource(codes, result.uncoveredlines);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Code coverage report for ${result.filename}</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="${relativePathofRoot}/resource/prettify.css" />
    <link rel="stylesheet" href="${relativePathofRoot}/resource/base.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      .coverage-summary .sorter {
        background-image: url(${relativePathofRoot}/resource/sort-arrow-sprite.png);
      }
    </style>
  </head>
  
  <body>
    <div class="wrapper">
      <div class="pad1">
        <h1><a href="${relativePathofRoot}/index.html">All files</a> / ${result.filename}</h1>
        <div class="clearfix">
          <div class="fl pad1y space-right2">
            <span class="strong">${result.statementCoverageRate.getRate()}% </span>
            <span class="quiet">Statements</span>
            <span class="fraction">${result.statementCoverageRate.toString()}</span>
          </div>

          <div class="fl pad1y space-right2">
            <span class="strong">${result.branchCoverageRate.getRate()}% </span>
            <span class="quiet">Branches</span>
            <span class="fraction">${result.branchCoverageRate.toString()}</span>
          </div>

          <div class="fl pad1y space-right2">
            <span class="strong">${result.functionCoverageRate.getRate()}% </span>
            <span class="quiet">Functions</span>
            <span class="fraction">${result.functionCoverageRate.toString()}</span>
          </div>

          <div class="fl pad1y space-right2">
            <span class="strong">${result.lineCoverageRate.getRate()}% </span>
            <span class="quiet">Lines</span>
            <span class="fraction">${result.lineCoverageRate.toString()}</span>
          </div>
        </div>
        <p class="quiet">
          Press <em>n</em> or <em>j</em> to go to the next uncovered block, <em>b</em>, <em>p</em> or <em>k</em> for the
          previous block.
        </p>
      </div>
      <div class="status-line high"></div>
      <pre>
        <table class="coverage">
          <tr>
<td class="line-count quiet">${lineCoutHtml}</td><td class="line-coverage quiet">${lineCov}</td><td class="text"><pre class="prettyprint lang-js">${lineSource}</pre></td>
          </tr>
        </table>
      </pre>
      <div class="push"></div> 
    </div>

    <div class="footer quiet pad2 space-top1 center small">
      Code coverage generated by 
      <a href="${Repository}" target="_blank">${OrganizationName}</a> 
      at ${new Date().toUTCString()}
    </div>

    <script src="${relativePathofRoot}/resource/prettify.js"></script> 
    <script>
      window.onload = function () {
        prettyPrint();
      };
    </script> 
    <script src="${relativePathofRoot}/resource/sorter.js"></script> 
    <script src="${relativePathofRoot}/resource/block-navigation.js"></script>
  </body>
</html>
  
  `;
}

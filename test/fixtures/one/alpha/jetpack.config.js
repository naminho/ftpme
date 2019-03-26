module.exports = {
  dist: 'public/demo',
  html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
    <title>{{{title}}}</title>
    {{#each assets.css}}
    <link rel="stylesheet" href='{{{.}}}' />
    {{/each}}
    {{{head}}}
  </head>
  <body>
    {{{body}}}
    {{#if assets.runtime}}
    <script type='text/javascript'>
    {{{assets.runtime}}}
    </script>
    {{/if}}
    {{#each assets.js}}
    <script type='text/javascript' src='.{{{.}}}' async></script>
    {{/each}}
  </body>
</html>`
}

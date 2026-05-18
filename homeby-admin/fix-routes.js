const fs = require('fs');
const files = [
  'src/routes/agencies/$id.tsx',
  'src/routes/agencies/index.tsx',
  'src/routes/agents.tsx',
  'src/routes/applications.tsx',
  'src/routes/dashboard.tsx',
  'src/routes/email-templates/$id.tsx',
  'src/routes/email-templates/index.tsx',
  'src/routes/integrations.tsx',
  'src/routes/login.tsx',
  'src/routes/staff.tsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const r = /export\s+const\s+Route\s*=\s*createFileRoute\([\s\S]*?\)\(\{[\s\S]*?component:\s*RouteComponent,?\s*\}\)[;]?\n*/;
  const m = c.match(r);
  if(m) {
    c = c.replace(m[0], '');
    c += '\n' + m[0].trim() + '\n';
    fs.writeFileSync(f, c);
    console.log('Fixed ' + f);
  } else {
    console.log('No match in ' + f);
  }
});

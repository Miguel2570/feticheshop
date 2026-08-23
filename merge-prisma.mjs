import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Merging Prisma schema...');

const prismaDir = path.join(__dirname, 'prisma');
const mainSchemaPath = path.join(prismaDir, 'schema.prisma');
const modelsDir = path.join(prismaDir, 'models');

// Verificar se o schema principal existe
if (!fs.existsSync(mainSchemaPath)) {
  console.error('❌ schema.prisma não encontrado');
  process.exit(1);
}

// Ler o schema principal
let mainSchema = fs.readFileSync(mainSchemaPath, 'utf8');

// Se a pasta models existir, faz merge
if (fs.existsSync(modelsDir)) {
  const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.prisma'));
  
  if (modelFiles.length > 0) {
    console.log(`📦 Encontrados ${modelFiles.length} arquivos de modelo`);
    
    let modelsContent = '';
    for (const file of modelFiles) {
      const content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
      modelsContent += '\n// ====== ' + file + ' ======\n' + content;
      console.log(`  ✅ ${file}`);
    }
    
    // Verificar se já existe conteúdo mesclado
    const mergeMarker = '// ====== MERGED MODELS ======';
    if (mainSchema.includes(mergeMarker)) {
      // Remover conteúdo mesclado anterior
      mainSchema = mainSchema.split(mergeMarker)[0];
    }
    
    // Adicionar modelos mesclados
    mainSchema += '\n' + mergeMarker + '\n' + modelsContent;
  } else {
    console.log('ℹ️ Nenhum arquivo de modelo encontrado');
  }
} else {
  console.log('ℹ️ Pasta models não encontrada');
}

// Escrever schema mesclado
fs.writeFileSync(mainSchemaPath, mainSchema);
console.log('✅ Prisma schema mesclado com sucesso!');
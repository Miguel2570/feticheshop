import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "miguelctobias2@gmail.com"; // Substitua pelo email real
  const password = "Veenus1!"; // Substitua pela senha real
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    console.log("❌ Usuário não encontrado");
    return;
  }
  
  console.log("✅ Usuário encontrado");
  console.log("Email:", user.email);
  console.log("Tem senha?", !!user.password);
  console.log("Hash da senha:", user.password?.substring(0, 20) + "...");
  console.log("Email verificado?", user.emailVerified);
  console.log("Email verificado em:", user.emailVerifiedAt);
  console.log("Conta ativa?", user.isActive);
  
  if (user.password) {
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Senha correta?", isValid);
    
    if (!isValid) {
      console.log("❌ A senha fornecida NÃO corresponde ao hash");
      console.log("Hash completo:", user.password);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
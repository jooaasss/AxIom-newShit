const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setUnlimitedCredits() {
  try {
    const clerkId = 'dw_940'
    const email = 'kalitestakk@gmail.com'
    const unlimitedCredits = 999999 // Using a very high number for "unlimited"

    // First, try to find user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkId },
        data: { credits: unlimitedCredits }
      })
      console.log(`✅ Updated credits for user ${clerkId} (${user.email}) to ${unlimitedCredits}`)
    } else {
      // Try to find by email
      user = await prisma.user.findUnique({
        where: { email }
      })

      if (user) {
        // Update existing user found by email
        user = await prisma.user.update({
          where: { email },
          data: { 
            credits: unlimitedCredits,
            clerkId: clerkId // Update clerkId if needed
          }
        })
        console.log(`✅ Updated credits for user ${email} to ${unlimitedCredits}`)
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            clerkId,
            email,
            credits: unlimitedCredits,
            firstName: 'DW',
            lastName: '940'
          }
        })
        console.log(`✅ Created new user ${clerkId} (${email}) with ${unlimitedCredits} credits`)
      }
    }

    console.log('User details:', {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      credits: user.credits
    })

  } catch (error) {
    console.error('❌ Error setting unlimited credits:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setUnlimitedCredits()
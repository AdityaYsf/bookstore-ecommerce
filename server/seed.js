const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookstore.com' },
    update: {},
    create: {
      email: 'admin@bookstore.com',
      password: adminPassword,
      name: 'Administrator',
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin created:', admin.email)

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER'
    }
  })
  console.log('✅ User created:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Fiksi' },
      update: {},
      create: { name: 'Fiksi', description: 'Novel dan cerita fiksi' }
    }),
    prisma.category.upsert({
      where: { name: 'Bisnis' },
      update: {},
      create: { name: 'Bisnis', description: 'Buku bisnis dan ekonomi' }
    }),
    prisma.category.upsert({
      where: { name: 'Teknologi' },
      update: {},
      create: { name: 'Teknologi', description: 'Programming dan tech' }
    }),
    prisma.category.upsert({
      where: { name: 'Self-Development' },
      update: {},
      create: { name: 'Self-Development', description: 'Pengembangan diri' }
    })
  ])
  console.log('✅ Categories created:', categories.length)

  // Create sample books
  const books = await Promise.all([
    prisma.book.upsert({
      where: { id: 'book-1' },
      update: {},
      create: {
        id: 'book-1',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        price: 150000,
        stock: 50,
        isbn: '978-0857197689',
        publisher: 'Harriman House',
        year: 2020,
        categoryId: categories[1].id
      }
    }),
    prisma.book.upsert({
      where: { id: 'book-2' },
      update: {},
      create: {
        id: 'book-2',
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'An easy & proven way to build good habits & break bad ones.',
        price: 175000,
        stock: 30,
        isbn: '978-0735211292',
        publisher: 'Avery',
        year: 2018,
        categoryId: categories[3].id
      }
    }),
    prisma.book.upsert({
      where: { id: 'book-3' },
      update: {},
      create: {
        id: 'book-3',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'A Handbook of Agile Software Craftsmanship.',
        price: 250000,
        stock: 20,
        isbn: '978-0132350884',
        publisher: 'Prentice Hall',
        year: 2008,
        categoryId: categories[2].id
      }
    }),
    prisma.book.upsert({
      where: { id: 'book-4' },
      update: {},
      create: {
        id: 'book-4',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        description: 'Between life and death there is a library.',
        price: 135000,
        stock: 15,
        isbn: '978-0525559474',
        publisher: 'Viking',
        year: 2020,
        categoryId: categories[0].id
      }
    }),
    prisma.book.upsert({
      where: { id: 'book-5' },
      update: {},
      create: {
        id: 'book-5',
        title: 'Zero to One',
        author: 'Peter Thiel',
        description: 'Notes on Startups, or How to Build the Future.',
        price: 165000,
        stock: 25,
        isbn: '978-0804139298',
        publisher: 'Crown Business',
        year: 2014,
        categoryId: categories[1].id
      }
    }),
    prisma.book.upsert({
      where: { id: 'book-6' },
      update: {},
      create: {
        id: 'book-6',
        title: 'Deep Work',
        author: 'Cal Newport',
        description: 'Rules for Focused Success in a Distracted World.',
        price: 145000,
        stock: 40,
        isbn: '978-1455586691',
        publisher: 'Grand Central Publishing',
        year: 2016,
        categoryId: categories[3].id
      }
    })
  ])
  console.log('✅ Books created:', books.length)

  console.log('\n🎉 Seeding completed!')
  console.log('\nLogin credentials:')
  console.log('Admin: admin@bookstore.com / admin123')
  console.log('User:  user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
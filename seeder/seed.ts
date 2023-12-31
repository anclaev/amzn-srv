import { PrismaClient, Product } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
  const products: Product[] = []

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName()
    const categoryName = faker.commerce.department()

    try {
      const product = await prisma.product.create({
        data: {
          name: productName,
          slug: faker.helpers.slugify(productName),
          description: faker.commerce.productDescription(),
          price: Number(faker.commerce.price({ min: 10, max: 999, dec: 0 })),
          images: Array.from({
            length: faker.number.int({ min: 2, max: 6 }),
          }).map(() => faker.image.url()),
          category: {
            create: {
              name: categoryName,
              slug: faker.helpers.slugify(categoryName),
            },
          },
          reviews: {
            create: [
              {
                rating: faker.number.int({ min: 2, max: 6 }),
                text: faker.lorem.paragraph(),
                user: {
                  connect: {
                    id: 1,
                  },
                },
              },
              {
                rating: faker.number.int({ min: 2, max: 6 }),
                text: faker.lorem.paragraph(),
                user: {
                  connect: {
                    id: 1,
                  },
                },
              },
            ],
          },
        },
      })

      products.push(product)
    } catch (e) {}
  }

  console.log(`Created ${products.length} products`)
}

async function main() {
  console.log('Start seeding...')

  await createProducts(10)
}

main()
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

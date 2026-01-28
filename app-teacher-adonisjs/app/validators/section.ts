import vine from '@vinejs/vine'
const sectionValidator = vine.compile(
  vine.object({
    // Utilisation d'un enum pour le genre
    name: vine.string().trim().minLength(2),
    // S'assurer que c'est un nombre entier positif
    sectionId: vine.number().positive(),
  })
)
export { sectionValidator }

import { SimpleMessagesProvider } from '@vinejs/vine'

export const frMessages = new SimpleMessagesProvider(
  {
    // Messages d'erreur
    'required': 'Le champ {{ field }} est obligatoire.',
    'minLength': 'Le champ {{ field }} doit faire au moins {{ min }} caractères.',
    'unique': 'Cette valeur pour {{ field }} est déjà utilisée.',
    'database.exists': 'La sélection est invalide.',
    'string': 'Le champ {{ field }} doit être du texte.',
  },
  {
    // Traduction des noms des champs (Attributes)
    title: 'Titre du deck',
    description: 'Description',
    question: 'Question',
    answer: 'Réponse',
  }
)

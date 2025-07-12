const Joi = require('joi');

const checkPhishSchema = Joi.object({
  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Format d\'URL invalide',
      'any.required': 'L\'URL est requise'
    })
});

const checkPhishStatusSchema = Joi.object({
  jobID: Joi.string()
    .required()
    .messages({
      'any.required': 'Le jobID est requis'
    })
});

const emailContentSchema = Joi.object({
  emailContent: Joi.string()
    .min(10)
    .max(50000)
    .required()
    .messages({
      'string.min': 'Le contenu de l\'email doit contenir au moins 10 caractères',
      'string.max': 'Le contenu de l\'email ne peut pas dépasser 50 000 caractères',
      'any.required': 'Le contenu de l\'email est requis'
    })
});

const scanIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'L\'ID doit être un nombre',
      'number.integer': 'L\'ID doit être un entier',
      'number.positive': 'L\'ID doit être positif',
      'any.required': 'L\'ID est requis'
    })
});

module.exports = {
  checkPhishSchema,
  checkPhishStatusSchema,
  emailContentSchema,
  scanIdSchema
}; 
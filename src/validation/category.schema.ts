
import {  z } from 'zod';

export const CreateCategorySchema = z.object({
    name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters'),
    description: z
    .string()
    .min(2, 'Category description must be at least 2 characters')
    .max(200, 'Category description must be at most 200 characters'),
    slug : z
    .string()
    .min(2, 'Category slug must be at least 2 characters')
    .max(50, 'Category slug must be at most 50 characters'),
})

export const CategoryIdParamsSchema = z.object({
    categoryId : z.string('Category Id is required')
})

export const UpdateCategorySchema = z.object({
    name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters')
    .optional(),
    description: z
    .string()
    .min(2, 'Category description must be at least 2 characters')
    .max(200, 'Category description must be at most 200 characters')
    .optional(),
    slug : z
    .string()
    .min(2, 'Category slug must be at least 2 characters')
    .max(50, 'Category slug must be at most 50 characters')
    .optional(),
    isActive : z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.toLowerCase() === "false") return false;
          if (val.toLowerCase() === "true") return true;
        }
        return val;
      },
      z.boolean('isActive must be boolean').optional()
    ),
})
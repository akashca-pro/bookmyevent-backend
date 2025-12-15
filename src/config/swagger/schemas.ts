/**
 * @openapi
 * components:
 *   schemas:
 *
 *     ApiResponse:
 *       type: object
 *       required: [success, message]
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates whether the request was successful
 *         message:
 *           type: string
 *           description: Human-readable message
 *         data:
 *           nullable: true
 *           description: Payload data or null
 *
 *     SuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *
 *     ErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             data:
 *               nullable: true
 *               example: null
 *
 *     ValidationErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [field, message]
 *                 properties:
 *                   field:
 *                     type: string
 *                     example: email
 *                   message:
 *                     type: string
 *                     example: Invalid email format
 *
 *     SignupRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: Akash
 *         email:
 *           type: string
 *           example: akash@gmail.com
 *         password:
 *           type: string
 *           example: Password@123
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: akash@gmail.com
 *         password:
 *           type: string
 *           example: Password@123
 *
 *     AuthResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               required: [id, name, email, role]
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProfileResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Profile'
 *
 *     Location:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         pincode:
 *           type: string
 *
 *     Availability:
 *       type: object
 *       properties:
 *         from:
 *           type: string
 *           format: date-time
 *         to:
 *           type: string
 *           format: date-time
 *
 *     Contact:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         pricePerDay:
 *           type: number
 *         description:
 *           type: string
 *         thumbnailUrl:
 *           type: string
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         availability:
 *           $ref: '#/components/schemas/Availability'
 *         contact:
 *           $ref: '#/components/schemas/Contact'
 *         isArchived:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PaginatedServiceResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *             total:
 *               type: number
 *             page:
 *               type: number
 *             limit:
 *               type: number
 *
 *     CreateServiceRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - pricePerDay
 *         - description
 *         - location
 *         - availability
 *         - contact
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         pricePerDay:
 *           type: number
 *         description:
 *           type: string
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         availability:
 *           $ref: '#/components/schemas/Availability'
 *         contact:
 *           $ref: '#/components/schemas/Contact'
 * 
 *     UpdateServiceRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         pricePerDay:
 *           type: number
 *         description:
 *           type: string
 *         isArchived: 
 *           type: boolean
 *         isActive: 
 *           type: boolean
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         availability:
 *           $ref: '#/components/schemas/Availability'
 *         contact:
 *           $ref: '#/components/schemas/Contact'
 *
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         serviceId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PaginatedBookingResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *             total:
 *               type: number
 *             page:
 *               type: number
 *             limit:
 *               type: number
 *
 *     CreateBookingRequest:
 *       type: object
 *       required: [startDate, endDate]
 *       properties:
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 */
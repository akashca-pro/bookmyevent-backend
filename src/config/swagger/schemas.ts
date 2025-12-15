/**
 * @openapi
 * components:
 *   schemas:
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           nullable: true
 *
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: VALIDATION_ERROR
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     ErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *
 *     SignupRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     AuthResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
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
 *     ProfileResponse:
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
 *     ProfileResponseWrapper:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/ProfileResponse'
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
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         availability:
 *           $ref: '#/components/schemas/Availability'
 *         contact:
 *           $ref: '#/components/schemas/Contact'
 *         isArchived:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *     PaginatedServiceResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
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
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Booking'
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *
 *     BookingByService:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             avatar:
 *               type: string
 *               nullable: true
 *         bookingDetails:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *             endDate:
 *               type: string
 *               format: date-time
 *             totalPrice:
 *               type: number
 *             status:
 *               type: string
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

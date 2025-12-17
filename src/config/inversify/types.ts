const TYPES = {
    // Repos
    IUserRepo : Symbol.for("IUserRepo"),
    IServiceRepo : Symbol.for("IServiceRepo"),
    IBookingRepo : Symbol.for("IBookingRepo"),
    ICategoryRepo : Symbol.for("ICategoryRepo"),

    // Services
    IAuthService : Symbol.for("IAuthService"),
    IProfileService : Symbol.for("IProfileService"),
    IServiceService : Symbol.for("IServiceService"),
    IBookingService : Symbol.for("IBookingService"),

    // providers
    Redis : Symbol.for("Redis"),
    IPasswordHasher: Symbol.for("IPasswordHasher"),
    ITokenProvider: Symbol.for("ITokenProvider"),
    ICacheProvider : Symbol.for("ICacheProvider"),
}

export default TYPES;
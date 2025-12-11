const TYPES = {
    // Repos
    IUserRepo : Symbol.for("IUserRepo"),
    IServiceRepo : Symbol.for("IServiceRepo"),
    IBookingRepo : Symbol.for("IBookingRepo"),

    // Services
    IAuthService : Symbol.for("IAuthService"),
    IProfileService : Symbol.for("IProfileService"),

    // providers
    Redis : Symbol.for("Redis"),
    IPasswordHasher: Symbol.for("IPasswordHasher"),
    ITokenProvider: Symbol.for("ITokenProvider"),
    ICacheProvider : Symbol.for("ICacheProvider"),
}

export default TYPES;
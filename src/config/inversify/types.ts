const TYPES = {
    // Repos
    IUserRepo : Symbol.for("IUserRepo"),

    // Services
    IAuthService : Symbol.for("IAuthService"),

    // providers
    Redis : Symbol.for("Redis"),
    IPasswordHasher: Symbol.for("IPasswordHasher"),
    ITokenProvider: Symbol.for("ITokenProvider"),
    ICacheProvider : Symbol.for("ICacheProvider"),
}

export default TYPES;
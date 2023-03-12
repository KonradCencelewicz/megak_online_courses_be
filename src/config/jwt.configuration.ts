const jwtConfig = {
  secret_at: String(process.env.JWT_SECRET_AT),
  secret_rt: String(process.env.JWT_SECRET_RT),
};

export default jwtConfig;
const jwtConfig = {
  secret_at: String(process.env.JWT_SECRET_AT),
  secret_rt: String(process.env.JWT_SECRET_RT),
  at_time: 60 * 5,
  rt_time: 60 * 60 * 24 * 7,
};

export default jwtConfig;
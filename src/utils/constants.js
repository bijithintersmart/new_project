const messages = {
  serverError: "Guys ithe adiche poyi guys",
  loginSuccess: "Well done boy, nigal eppol login ayirikunu",
  emailError: "Email evidea?",
  passwordError: "Password enni nj vanne adikanno?",
  userExitsError: "Vearea email eduke ithe already inde mister.",
  userNullError: "Eganea oru user evidea ellalo!.",
  wrongPassword: "Yada password noki adikada.",
  tokenError: "Token kannan ella token evdiea",
  unAuthorized: "Poyi puthiya token edukada",
  notFound: "Sorry, e api chyithila keatto.",
  userDataUpdate: "Thangaludea data update ayirikunu",
  passwordAlreadyUsed: (user) =>
    `Stop please, E password use chyiyan pattila ithe ${
      user?.name || "unknown user"
    } use chyiyunude`,
  methodNotAllowed: (reqMeth, allowMeth) =>
    `Na kettathu ${allowMeth},ana avaru koduthathu ${reqMeth}`,
};

export default messages;
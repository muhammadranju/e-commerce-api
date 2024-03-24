const mails = {
  google: "@gmail.com",
  outlook: "@outlook.com",
  aol: "@aol.com",
  yahoo: "@yahoo.com",
  icloud: "@icloud.com",
  proton: "@proton.me",
  protonmail: "@protonmail.com",
  mail: "@mail.com",
};
function customEmailValidator(email) {
  email = email.toString();
  if (
    email.includes(mails.google) ||
    email.includes(mails.outlook) ||
    email.includes(mails.aol) ||
    email.includes(mails.yahoo) ||
    email.includes(mails.icloud) ||
    email.includes(mails.proton) ||
    email.includes(mails.protonmail) ||
    email.includes(mails.mail)
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = customEmailValidator;

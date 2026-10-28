export function toUserDTO(user) {
  return {
    id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isAccountBlocked: user.isAccountBlocked,
    idType: user.idType,
    idNumber: user.idNumber,
  };
}

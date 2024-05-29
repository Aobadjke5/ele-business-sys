const verifyUsername = (username) => {
  if (username.length < 4 || username.length > 16)
    return { status: false, message: "用户名长度应在4-16位之间" }
  let regex = /^[a-zA-Z0-9_]*$/
  if (regex.test(username)) 
    return { status: true }
  return { status: false, message: "用户名只能包含字母、数字、下划线" }
}

const verifyPassword = (password) => {
  if (password.length < 8 || password.length > 16)
    return { status: false, message: "密码长度应在8-16位之间" }

  let regex1 = /^.*\d.*$/
  if(!regex1.test(password))
    return { status: false, message: "密码至少包含一个数字" }
  let regex2 = /^.*[a-zA-Z].*$/
  if(!regex2.test(password))
    return { status: false, message: "密码至少包含一个字母" }

  let regex3 = /^[a-zA-Z0-9!@#$%_-]*$/
  if(!regex3.test(password))
    return { status: false, message: "密码包含非法字符" }
  return { status: true }
}

export { verifyUsername, verifyPassword }

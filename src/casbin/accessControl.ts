import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = sub, obj, act

  [role_definition]
  g = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
p, 1, users, (list)|(create)|(edit)|(show)|(delete)
p, 1, articles, (list)|(create)|(edit)|(show)|(delete)

p, 2, articles, (list)|(create)|(edit)|(show)|(delete)

p, 3, articles, (list)|(show)
`);
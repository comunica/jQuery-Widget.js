async function getNamespace(input) {
  const url = new URL(new Request(input).url);
  return url.origin + url.pathname;
}

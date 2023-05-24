export async function parseEPA(content) {
  let rows = content.split("\n");
  let JSONrows = [];

  console.log(rows.length);

  rows.forEach((row) => {
    let parts = row.split(" ");
    if (parts.length !== 7) return;
    let host = parts[0];
    let dateParts = parts[1].substring(1, parts[1].length - 1).split(":");
    let dateTime = {
      day: dateParts[0],
      hour: dateParts[1],
      minute: dateParts[2],
      second: dateParts[3],
    };
    let request = {
      method: parts[2].substring(1, parts[2].length),
      url: parts[3].substring(0, parts[3].length),
      protocol: parts[4].substring(0, 4),
      protocol_version: parts[4].substring(5, 8),
    };
    let response_code = parts[5];
    let failCode = response_code !== "200";
    let document_size = failCode
      ? "0"
      : parts[6].substring(0, parts[6].length - 1);

    let epa_object = {
      host,
      dateTime,
      request,
      response_code,
      document_size,
    };
    //console.log(JSON.stringify(epa_object));
    JSONrows.push(epa_object);
  });

  return JSONrows;
}

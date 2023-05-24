export async function parseEPA(content) {
  let rows = content.split("\n");
  let JSONrows = [];

  console.log(rows.length);

  rows.forEach((row) => {
    let partes = row.split(" ");
    let host = partes[0];
    let dateParts = partes[1].substring(1, partes[1].length - 1).split(":");
    let dateTime = {
      day: dateParts[0],
      hour: dateParts[1],
      minute: dateParts[2],
      second: dateParts[3],
    };
    let request = {
      method: partes[2].substring(1, partes[2].length),
      url: partes[3].substring(0, partes[3].length),
      protocol: partes[4].substring(0, 4),
      protocol_version: partes[4].substring(5, 8),
    };
    let response_code = partes[5];
    let failCode = response_code !== "200";
    let document_size = failCode
      ? "0"
      : partes[6].substring(0, partes[6].length - 1);

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

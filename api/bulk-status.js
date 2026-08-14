import {
  callAlightMotion,
  onlyGet,
  sendJson
} from "./_upstream.js";

function finiteInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
}

function publicStatus(data) {
  const source = data?.data ?? data?.result ?? data ?? {};
  const bulkMax = finiteInteger(source.bulk_max);
  const remaining = finiteInteger(source.bulk_remaining_today);
  const unlimitedDaily = source.unlimited_daily === true;

  if (bulkMax === null || (!unlimitedDaily && remaining === null)) return null;

  return {
    status: true,
    bulk_max: bulkMax,
    bulk_remaining_today: unlimitedDaily ? null : remaining,
    unlimited_daily: unlimitedDaily
  };
}

export default async function handler(req, res) {
  if (!onlyGet(req, res)) return;

  try {
    const upstream = await callAlightMotion("access-status");
    const status = upstream.ok ? publicStatus(upstream.data) : null;

    if (!status) {
      return sendJson(res, 502, {
        status: false,
        message: "Status limit Bulk sementara tidak tersedia."
      });
    }

    return sendJson(res, 200, status);
  } catch {
    return sendJson(res, 502, {
      status: false,
      message: "Status limit Bulk sementara tidak tersedia."
    });
  }
}

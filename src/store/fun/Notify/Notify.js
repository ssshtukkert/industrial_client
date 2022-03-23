// -------------------- Всплывающее сообщение
import { CheckDataJson } from '../CheckData/CheckData';

const NotifyMessage = (getJson, q) => {
  if (CheckDataJson(getJson.Message)) {
    q.notify({
      message: getJson.Message,
      color: 'secondary',
      position: 'bottom',
    });
  }
  if (CheckDataJson(getJson.errorMessage)) {
    q.notify({
      message: getJson.errorMessage,
      color: 'negative',
      position: 'bottom',
    });
  }
};

export {
  NotifyMessage,
};

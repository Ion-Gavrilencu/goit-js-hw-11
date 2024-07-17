import Notiflix from 'notiflix';

export const notifySuccess = message => {
  Notiflix.Notify.success(message);
};

export const notifyFailure = message => {
  Notiflix.Notify.failure(message);
};

export const notifyInfo = message => {
  Notiflix.Notify.info(message);
};

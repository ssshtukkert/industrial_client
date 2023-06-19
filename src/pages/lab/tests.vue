<template>
  <q-page style="background-color: rgb(80, 80, 80);">
    <q-card-section v-show="loadComplete" class="text-white" >
      <div class="text-h6">
        Испытания
      </div>
    </q-card-section>
    <q-card-section v-show="loadComplete" class="text-black q-pa-sm" style="background-color: rgb(60, 60, 60);">
      <div class="row">
        <div class="col-4 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Подача "вытяжного" воздуха/параметры воздуха в канале №11
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор13:
                  <div class="text-h6 text-white">
                    {{ Speed_11_13 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор5:
                  <div class="text-h6 text-white">
                    {{ Speed_12_5 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Скорость воздуха средняя:
                  <div class="text-h6 text-white">
                    {{ Speed_11_Sr }} м/с
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор14:
                  <div class="text-h6 text-white">
                    {{ Speed_11_14 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор6:
                  <div class="text-h6 text-white">
                    {{ Speed_12_6 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Объёмный расход воздуха:
                  <div class="text-h6 text-white">
                    {{ m3h_11 }} м<sup>3</sup>/ч
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор15:
                  <div class="text-h6 text-white">
                    {{ Speed_11_15 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор7:
                  <div class="text-h6 text-white">
                    {{ Speed_12_7 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Массовый расход воздуха:
                  <div class="text-h6 text-white">
                    {{ mass_11 }} кг/с
                  </div>
                  <div class="text-h6 text-white">
                    {{ (mass_11 * 3600).toFixed(2) }} кг/ч
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор16:
                  <div class="text-h6 text-white">
                    {{ Speed_11_16 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор8:
                  <div class="text-h6 text-white">
                    {{ Speed_12_8 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Давление воздуха:
                  <div class="text-h6 text-white">
                    {{ Pressure_11 }} Па
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-grey">
              Плотность воздуха:
              <div class="text-h6 text-white">
                {{ Plotnost_11 }} кг/м<sup>3</sup>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Температура и относительная влажность воздуха в канале №11
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6 text-grey">
                  Т19:
                  <div class="text-h6 text-white">
                    {{ T_TMA19_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл19:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA19_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т20:
                  <div class="text-h6 text-white">
                    {{ T_TMA20_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл20:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA20_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т21:
                  <div class="text-h6 text-white">
                    {{ T_TMA21_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл21:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA21_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т22:
                  <div class="text-h6 text-white">
                    {{ T_TMA22_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл22:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA22_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т23:
                  <div class="text-h6 text-white">
                    {{ T_TMA23_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл23:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA23_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т24:
                  <div class="text-h6 text-white">
                    {{ T_TMA24_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл24:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA24_11 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Температура средняя:
                  <div class="text-h6 text-white">
                    {{ T_11 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Влагосодержание среднее:
                  <div class="text-h6 text-white">
                    {{ Rh_11 }} %
                  </div>
                  <div class="text-h6 text-white">
                    {{ Hc_11 }} г/кг
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <div class="row fit">
            <q-card class="text-white" style="background-color: rgb(60, 60, 60);">
              <q-card-section style="background-color: rgb(80, 80, 80);">
                <div class="text-h8">
                  Перепад давления воздуха между каналами №11 и №12
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-12 text-grey" align="center">
                    <div class="text-h6 text-white">
                      {{ deltap_11_12 }} Па
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card class="text-white full-width" style="background-color: rgb(60, 60, 60);">
              <q-card-section style="background-color: rgb(80, 80, 80);">
                <div class="text-h8">
                  Увлажнение/осушение
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-12 text-grey" align="center">
                    <div class="text-h6 text-white">
                      {{ deltahum_vyt }} г/кг
                    </div>
                    <div class="text-h6 text-white">
                      {{ masshum_vyt }} кг/ч
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Температура и относительная влажность воздуха в канале №12
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6 text-grey">
                  Т7:
                  <div class="text-h6 text-white">
                    {{ T_TMA7_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл7:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA7_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т8:
                  <div class="text-h6 text-white">
                    {{ T_TMA8_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл8:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA8_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т9:
                  <div class="text-h6 text-white">
                    {{ T_TMA9_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл9:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA9_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т10:
                  <div class="text-h6 text-white">
                    {{ T_TMA10_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл10:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA10_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т11:
                  <div class="text-h6 text-white">
                    {{ T_TMA11_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл11:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA11_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Т12:
                  <div class="text-h6 text-white">
                    {{ T_TMA12_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл12:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA12_12 }} %
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-grey">
                  Температура средняя:
                  <div class="text-h6 text-white">
                    {{ T_12 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Влагосодержание среднее:
                  <div class="text-h6 text-white">
                    {{ Rh_12 }} %
                  </div>
                  <div class="text-h6 text-white">
                    {{ Hc_12 }} г/кг
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h7">
                Удаление "вытяжного" воздуха/параметры воздуха в канале №12
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-12 text-grey">
                  Объёмный расход воздуха:
                  <div class="text-h6 text-white">
                    {{ m3h_12 }} м<sup>3</sup>/ч
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 text-grey">
                  Массовый расход воздуха:
                  <div class="text-h6 text-white">
                    {{ mass_12 }} кг/с
                  </div>
                  <div class="text-h6 text-white">
                    {{ (mass_12 * 3600).toFixed(2) }} кг/ч
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12  text-grey">
                  Давление воздуха:
                  <div class="text-h6 text-white">
                    {{ Pressure_12 }} Па
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-grey">
              Плотность воздуха:
              <div class="text-h6 text-white">
                {{ Plotnost_12 }} кг/м<sup>3</sup>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-pa-sm">
          <q-card class="col-4 text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h6">
                Перепад давления воздуха между каналами №11/№22 и рассчитанные показатели
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row full-height">
                <div class="col-4 text-grey" align="center">
                  Перепад давления воздуха между каналами №11 и №22:
                  <div class="text-h6 text-white">
                    {{ deltap_11_22 }} Па
                  </div>
                </div>
                <div class="col-2 text-grey" align="center">
                  Тепловой баланс:
                  <div class="text-h6 text-white">
                    {{ warmBalance }}
                  </div>
                </div>
                <div class="col-2 text-grey" align="center">
                  Температурный КПД:
                  <div class="text-h6 text-white">
                    {{ KPD_T }} %
                  </div>
                </div>
                <div class="col-2 text-grey" align="center">
                  Влажностный КПД:
                  <div class="text-h6 text-white">
                    {{ KPD_H }}
                  </div>
                </div>
                <div v-if="alarmsBURR" class="col-2 text-grey" align="center">
                  Скорость БУРР:
                  <div class="text-h6 text-white">
                    {{ rotorSpeed }} ({{ rotorSpeedCalc }}) об/мин
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="col-4 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Подача "приточного" воздуха/параметры воздуха в канале №21
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор1:
                  <div class="text-h6 text-white">
                    {{ Speed_21_1 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор9:
                  <div class="text-h6 text-white">
                    {{ Speed_22_9 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Скорость воздуха средняя:
                  <div class="text-h6 text-white">
                    {{ Speed_21_Sr }} м/с
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор2:
                  <div class="text-h6 text-white">
                    {{ Speed_21_2 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор10:
                  <div class="text-h6 text-white">
                    {{ Speed_22_10 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Объёмный расход воздуха:
                  <div class="text-h6 text-white">
                    {{ m3h_21 }} м<sup>3</sup>/ч
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор3:
                  <div class="text-h6 text-white">
                    {{ Speed_21_3 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор11:
                  <div class="text-h6 text-white">
                    {{ Speed_22_11 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Массовый расход воздуха:
                  <div class="text-h6 text-white">
                    {{ mass_21 }} кг/с
                  </div>
                  <div class="text-h6 text-white">
                    {{ (mass_21 * 3600).toFixed(2) }} кг/ч
                  </div>
                </div>
              </div>
              <div class="row full-height items-center">
                <div class="col-4 text-grey">
                  Скор4:
                  <div class="text-h6 text-white">
                    {{ Speed_21_4 }} м/с
                  </div>
                </div>
                <div class="col-3 text-grey">
                  Скор12:
                  <div class="text-h6 text-white">
                    {{ Speed_22_12 }} м/с
                  </div>
                </div>
                <div class="col-5 text-grey">
                  Давление воздуха:
                  <div class="text-h6 text-white">
                    {{ Pressure_21 }} Па
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-grey">
              Плотность воздуха:
              <div class="text-h6 text-white">
                {{ Plotnost_21 }} кг/м<sup>3</sup>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Температура и относительная влажность воздуха в канале №21
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6 text-grey">
                  Т1:
                  <div class="text-h6 text-white">
                    {{ T_TMA1_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл1:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA1_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т2:
                  <div class="text-h6 text-white">
                    {{ T_TMA2_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл2:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA2_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т3:
                  <div class="text-h6 text-white">
                    {{ T_TMA3_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл3:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA3_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т4:
                  <div class="text-h6 text-white">
                    {{ T_TMA4_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл4:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA4_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т5:
                  <div class="text-h6 text-white">
                    {{ T_TMA5_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл5:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA5_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т6:
                  <div class="text-h6 text-white">
                    {{ T_TMA6_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл6:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA6_21 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Температура средняя:
                  <div class="text-h6 text-white">
                    {{ T_21 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Влагосодержание среднее:
                  <div class="text-h6 text-white">
                    {{ Rh_21 }} %
                  </div>
                  <div class="text-h6 text-white">
                    {{ Hc_21 }} г/кг
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <div class="row fit">
            <q-card class="text-white" style="background-color: rgb(60, 60, 60);">
              <q-card-section style="background-color: rgb(80, 80, 80);">
                <div class="text-h8">
                  Перепад давления воздуха между каналами №21 и №22
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-12 text-grey">
                    <div class="text-h6 text-white" align="center">
                      {{ deltap_21_22 }} Па
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card class="text-white full-width" style="background-color: rgb(60, 60, 60);">
              <q-card-section style="background-color: rgb(80, 80, 80);">
                <div class="text-h8">
                  Увлажнение/осушение
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-12 text-grey" align="center">
                    <div class="text-h6 text-white">
                      {{ deltahum_pr }} г/кг
                    </div>
                    <div class="text-h6 text-white">
                      {{ masshum_pr }} кг/ч
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h8">
                Температура и относительная влажность воздуха в канале №22
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6 text-grey">
                  Т13:
                  <div class="text-h6 text-white">
                    {{ T_TMA13_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл13:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA13_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т14:
                  <div class="text-h6 text-white">
                    {{ T_TMA14_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл14:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA14_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т15:
                  <div class="text-h6 text-white">
                    {{ T_TMA15_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл15:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA15_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т16:
                  <div class="text-h6 text-white">
                    {{ T_TMA16_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл16:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA16_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т17:
                  <div class="text-h6 text-white">
                    {{ T_TMA17_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл17:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA17_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Т18:
                  <div class="text-h6 text-white">
                    {{ T_TMA18_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Вл18:
                  <div class="text-h6 text-white">
                    {{ Rh_TMA18_22 }} %
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-6 text-grey">
                  Температура средняя:
                  <div class="text-h6 text-white">
                    {{ T_22 }} °С
                  </div>
                </div>
                <div class="col-6 text-grey">
                  Влагосодержание среднее:
                  <div class="text-h6 text-white">
                    {{ Rh_22 }} %
                  </div>
                  <div class="text-h6 text-white">
                    {{ Hc_22 }} г/кг
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2 q-pa-xs">
          <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h7">
                Удаление "приточного" воздуха/параметры воздуха в канале №22
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-12 text-grey">
                  Объёмный расход воздуха:
                  <div class="text-h6 text-white">
                    {{ m3h_22 }} м<sup>3</sup>/ч
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-12 text-grey">
                  Массовый расход воздуха:
                  <div class="text-h6 text-white">
                    {{ mass_22 }} кг/с
                  </div>
                  <div class="text-h6 text-white">
                    {{ (mass_22 * 3600).toFixed(2) }} кг/ч
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row">
                <div class="col-12 text-grey">
                  ДавлПриток После (22):
                  <div class="text-h6 text-white">
                    {{ Pressure_22 }} Па
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-grey">
              Плотность воздуха:
              <div class="text-h6 text-white">
                {{ Plotnost_22 }} кг/м<sup>3</sup>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <Chart :ref="charts[0]" name='Перепад давления воздуха между каналами №11/№22, Па'
            :parameters="[{ name: 'Давление', color: 'rgb(97, 138, 199)' }]" chartId="chart0" colorDefault="yellow"
            :legend="false" classTitle="text-h6" classValue="text-h6" :height="80" valueMeasure="Па" />
        </div>
        <div class="col-6">
          <Chart :ref="charts[1]" name='Управление ресивер Вытяжки, %'
            :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart1"
            colorDefault="yellow" :legend="false" classValue="text-h6" classTitle="text-h6" :height="80"
            valueMeasure="%" />
        </div>
      </div>
      <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
        <q-card-section style="background-color: rgb(80, 80, 80);">
          <div class="text-h6">
            Внешние условия
          </div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col-6 text-grey" align="center">
            Атмосферное давление:
            <div class="text-h6 text-white">
              {{ Patm }} кПа
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row" align="center">
          <div class="col-6 text-grey">
            Температура наружного воздуха:
            <div class="text-h6 text-white">
              {{ SCo_t_nar }} °С
            </div>
          </div>
          <div class="col-6 text-grey">
            Температура воздуха в помещении:
            <div class="text-h6 text-white">
              {{ T_Lab }} °С
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row" align="center">
          <div class="col-6 text-grey">
            Влагосодержание наружного воздуха:
            <div class="text-h6 text-white">
              {{ SCo_Abs_nar }} г/кг
            </div>
          </div>
          <div class="col-6 text-grey">
            Влогосодержание воздуха в помещении:
            <div class="text-h6 text-white">
              {{ Hc_Lab }} г/кг
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row" align="center">
          <div class="col-6 text-grey">
            Относительная влажность наружного воздуха:
            <div class="text-h6 text-white">
              {{ SCo_Rh_nar }} %
            </div>
          </div>
          <div class="col-6 text-grey">
            Относительная влажность воздуха в помещении:
            <div class="text-h6 text-white">
              {{ Rh_Lab }} %
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="row">
        <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">
              Запись
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="text-h6">
                  Состояние записи:
                  <div
                    :class="getcolorStatus(statusWrite === 'Готов к останову' || statusWrite === 'Запись' || statusWrite === 'Запись/Готов к останову')">
                    {{ statusWrite }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-h6">
                  Состояние БД:
                  <div :class="getcolorStatus(statusBD === 'OK')">
                    {{ statusBD }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <q-toggle v-model="modeWrite" class="full-width" label="Режим запись"
                  @update:model-value="enterPassword(updateModeWrite)" />
              </div>
              <div class="col-3">
                <q-toggle v-model="autoWrite" :disable="!pause" class="full-width" label="Автозапись"
                  @update:model-value="enterPassword(updateAutoWrite)" />
              </div>
              <div class="col-3">
                <!-- @update:model-value="updateCountRegisterWrite" -->
                <q-input ref="comp_countRegisterWrite" v-model="countRegisterWrite" color="white"
                  input-class="text-h6 text-white" outlined label-color="white" type="number"
                  label="Количество регистраций"
                  :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']" style="width: 178px;"
                  @focus="focus_countRegisterWrite = true" @blur="enterPassword(updateCountRegisterWrite)"
                  @keydown.enter.prevent="enterPassword(updateCountRegisterWrite)" />
              </div>
              <div class="col-3">
                <!-- <q-toggle v-model="pause" class="full-width" label="Пауза" :disable="lock_pause > 0"
                  @update:model-value="enterPassword(updatePause)" /> -->
                  <q-btn class="text-white" :disable="!modeWrite" :color="colorPause" :label="labelPause" @click="send('togglePause')" />
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <div class="text-h6">
                  Всего записей:
                  {{ countAutoWrite }}
                </div>
              </div>
              <div class="col-3">
                <div class="text-h6">
                  Количество текущих регистраций:
                  {{ countWrite }}
                </div>
              </div>
              <div class="col-3">
              </div>
              <div class="col-3">
                <div class="text-h6">
                  <q-btn :disable="dateStart == ''" color="teal" label="Загрузить промежуточный отчёт" target="_self"
                    :href="getRouteOrder" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="row">
        <q-card class="col-4 fit text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">
              Статусы
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-6" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Подготовка воздуха</div>
                  <q-tr>
                    <q-th>Показатель</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Температура «приточного» воздуха в канале №21 в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[10])">{{ parsebool(CodeStatus2[10]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Относительная влажность «приточного» воздуха в канале №21 в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[11])">{{ parsebool(CodeStatus2[11]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Температура «вытяжного» воздуха в канале №11 в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[12])">{{ parsebool(CodeStatus2[12]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Относительная влажность «вытяжного» воздуха в канале №11 в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[13])">{{ parsebool(CodeStatus2[13]) }}</q-td>
                  </q-tr>
                </table>
              </div>
              <div class="col-6" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Подготовка объёма и перепада давления воздуха</div>
                  <q-tr>
                    <q-th>Показатель</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Удаляемый вентилятор Притока в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[4])">{{ parsebool(CodeStatus2[4]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Удаляемый вентилятор Вытяжка в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[6])">{{ parsebool(CodeStatus2[6]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Клапан подачи воздуха ресивера «Вытяжка» в режиме</q-td>
                    <q-td :class="getcolor(CodeStatus2[5])">{{ parsebool(CodeStatus2[5]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Фиксация удаляемого вентилятора Приток</q-td>
                    <q-td :class="getcolor(CodeStatus2[7])">{{ parsebool(CodeStatus2[7]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Фиксация удаляемого вентилятора Вытяжка</q-td>
                    <q-td :class="getcolor(CodeStatus2[8])">{{ parsebool(CodeStatus2[8]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Фиксация ресивера Вытяжка по давлению</q-td>
                    <q-td :class="getcolor(CodeStatus2[9])">{{ parsebool(CodeStatus2[9]) }}</q-td>
                  </q-tr>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="col-3" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Приток 1</div>
                  <q-tr>
                    <q-th>Оборудование</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Смешение</q-td>
                    <q-td :class="getcolor(CodeStatus1[0])">{{ parsebool(CodeStatus1[0]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Водяной калорифер</q-td>
                    <q-td :class="getcolor(CodeStatus1[1])">{{ parsebool(CodeStatus1[1]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Влажность</q-td>
                    <q-td :class="getcolor(CodeStatus1[2])">{{ parsebool(CodeStatus1[2]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Вентилятор</q-td>
                    <q-td :class="getcolor(CodeStatus1[3])">{{ parsebool(CodeStatus1[3]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Температура</q-td>
                    <q-td :class="getcolor(CodeStatus1[4])">{{ parsebool(CodeStatus1[4]) }}</q-td>
                  </q-tr>
                </table>
              </div>
              <div class="col-3" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Вытяжка</div>
                  <q-tr>
                    <q-th>Оборудование</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Смешение</q-td>
                    <q-td :class="getcolor(CodeStatus1[5])">{{ parsebool(CodeStatus1[5]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Водяной калорифер</q-td>
                    <q-td :class="getcolor(CodeStatus1[6])">{{ parsebool(CodeStatus1[6]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Влажность</q-td>
                    <q-td :class="getcolor(CodeStatus1[7])">{{ parsebool(CodeStatus1[7]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Вентилятор</q-td>
                    <q-td :class="getcolor(CodeStatus1[8])">{{ parsebool(CodeStatus1[8]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Температура</q-td>
                    <q-td :class="getcolor(CodeStatus1[9])">{{ parsebool(CodeStatus1[9]) }}</q-td>
                  </q-tr>
                </table>
              </div>
              <div class="col-3" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Приток 2</div>
                  <q-tr>
                    <q-th>Оборудование</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Смешение</q-td>
                    <q-td :class="getcolor(CodeStatus2[0])">{{ parsebool(CodeStatus2[0]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Вентилятор</q-td>
                    <q-td :class="getcolor(CodeStatus2[1])">{{ parsebool(CodeStatus2[1]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Температура</q-td>
                    <q-td :class="getcolor(CodeStatus2[2])">{{ parsebool(CodeStatus2[2]) }}</q-td>
                  </q-tr>
                </table>
              </div>
              <div class="col-3" style="padding: 10px;">
                <table style="width: 100%;">
                  <div class="text-h6">Удаляемые</div>
                  <q-tr>
                    <q-th>Оборудование</q-th>
                    <q-th>В режиме</q-th>
                  </q-tr>
                  <q-tr>
                    <q-td>Режим удаляемого вентилятора «Приток»</q-td>
                    <q-td :class="getcolor(CodeStatus2[4])">{{ parsebool(CodeStatus2[4]) }}</q-td>
                  </q-tr>
                  <q-tr>
                    <q-td>Режим удаляемого вентилятора «Вытяжка»</q-td>
                    <q-td :class="getcolor(CodeStatus2[6])">{{ parsebool(CodeStatus2[6]) }}</q-td>
                  </q-tr>
                </table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
    <q-inner-loading :showing="!loadComplete" color="white" style="height: 100%" label-class="text-white"
            label-style="font-size: 1.1em" label="Получение данных с щита управления"/>
    <q-dialog v-model="changeDialog" ref="comp_inputPassword" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section style="background-color: rgb(80, 80, 80);">
          <div class="text-h6 text-white">Авторизованный доступ</div>
        </q-card-section>
        <q-card-section class="row text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section class="col-6">
            Для внесения изменений в работу установки введите сервисный пароль:
          </q-card-section>
          <q-card-section class="col-6 q-pt-none">
            <q-input ref="comp_inputPassword" v-model="inputPassword" clearable dark type="password" label="Пароль"
              @clear="inputPassword = ''" color="white" input-class="text-h6 text-white" outlined label-color="grey" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" style="background-color: rgb(80, 80, 80);">
          <q-btn class="bg-teal text-white" label="Принять" @click="confirmPassword"
            :disable="inputPassword.length == 0" />
          <q-btn ref="confirmPass" class="bg-teal text-white" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="errorPasswordDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ошибка</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Неверный пароль
        </q-card-section>
        <q-card-actions align="right" class="bg-red text-white">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alarmMessage" :position="position">
      <q-card class="bg-red" style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div class="col text-h6 text-white">
            Авария
          </div>
          <q-btn class="col text-white" color="primary" label="Журнал аварий" :href="`http://${host}/#/lab/recup/alarms`"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

</template>
<script>
import {
  ref, inject, onMounted, onBeforeUnmount,
} from 'vue';
import axios from 'axios';
import Chart from 'src/components/charts/chart_v2.vue';

export default {
  name: 'tests',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Испытания';
    const dataValues0 = [];
    const dataValues1 = [];
    const load = ref(0);
    const changeDialog = ref(false);
    const errorPasswordDialog = ref(false);
    let password = localStorage.getItem('passwordLab') || '';
    const inputPassword = ref(password);
    const comp_inputPassword = ref(null);
    const confirmPass = ref(null);
    const loadComplete = ref(false);
    const {
      host, getCurrentTime, WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, TRUE_PASSWORD,
    } = inject('store');
    const charts = [];
    for (let index = 0; index < 2; index += 1) {
      charts.push(ref(null));
    }
    const alarmMessage = ref(false);
    const position = ref('top');
    const modeWrite = ref(false);
    const lock_modeWrite = ref(0);
    const autoWrite = ref(false);
    const lock_autoWrite = ref(0);
    const pause = ref(true);
    // const lock_pause = ref(0);
    const colorPause = ref('grey');
    const countRegisterWrite = ref(10);
    const comp_countRegisterWrite = ref(null);
    const focus_countRegisterWrite = ref(false);
    const statusWrite = ref('FAIL');
    const statusBD = ref('ERROR');
    const countWrite = ref(0);
    const countAutoWrite = ref(0);

    const CodeStatus1 = ref([]);
    const CodeStatus2 = ref([]);
    // температура в лаборатории
    const T_Lab = ref(0);
    // давление атмосферное
    const Patm = ref(0);
    // тепловой баланс
    const warmBalance = ref(0);
    // скорость вращения роторного рекуператора
    const rotorSpeed = ref(0);
    // расчётная скорость вращения роторного рекуператора
    const rotorSpeedCalc = ref(0);
    // температура
    const T_TMA1_21 = ref(0);
    const T_TMA2_21 = ref(0);
    const T_TMA3_21 = ref(0);
    const T_TMA4_21 = ref(0);
    const T_TMA5_21 = ref(0);
    const T_TMA6_21 = ref(0);
    const T_TMA7_12 = ref(0);
    const T_TMA8_12 = ref(0);
    const T_TMA9_12 = ref(0);
    const T_TMA10_12 = ref(0);
    const T_TMA11_12 = ref(0);
    const T_TMA12_12 = ref(0);
    const T_TMA13_22 = ref(0);
    const T_TMA14_22 = ref(0);
    const T_TMA15_22 = ref(0);
    const T_TMA16_22 = ref(0);
    const T_TMA17_22 = ref(0);
    const T_TMA18_22 = ref(0);
    const T_TMA19_11 = ref(0);
    const T_TMA20_11 = ref(0);
    const T_TMA21_11 = ref(0);
    const T_TMA22_11 = ref(0);
    const T_TMA23_11 = ref(0);
    const T_TMA24_11 = ref(0);

    // отн. влажность
    const Rh_TMA1_21 = ref(0);
    const Rh_TMA2_21 = ref(0);
    const Rh_TMA3_21 = ref(0);
    const Rh_TMA4_21 = ref(0);
    const Rh_TMA5_21 = ref(0);
    const Rh_TMA6_21 = ref(0);
    const Rh_TMA7_12 = ref(0);
    const Rh_TMA8_12 = ref(0);
    const Rh_TMA9_12 = ref(0);
    const Rh_TMA10_12 = ref(0);
    const Rh_TMA11_12 = ref(0);
    const Rh_TMA12_12 = ref(0);
    const Rh_TMA13_22 = ref(0);
    const Rh_TMA14_22 = ref(0);
    const Rh_TMA15_22 = ref(0);
    const Rh_TMA16_22 = ref(0);
    const Rh_TMA17_22 = ref(0);
    const Rh_TMA18_22 = ref(0);
    const Rh_TMA19_11 = ref(0);
    const Rh_TMA20_11 = ref(0);
    const Rh_TMA21_11 = ref(0);
    const Rh_TMA22_11 = ref(0);
    const Rh_TMA23_11 = ref(0);
    const Rh_TMA24_11 = ref(0);

    // плотность
    const Plotnost_11 = ref(0);
    const Plotnost_12 = ref(0);
    const Plotnost_21 = ref(0);
    const Plotnost_22 = ref(0);

    // скорость
    const Speed_21_1 = ref(0);
    const Speed_21_2 = ref(0);
    const Speed_21_3 = ref(0);
    const Speed_21_4 = ref(0);
    const Speed_12_5 = ref(0);
    const Speed_12_6 = ref(0);
    const Speed_12_7 = ref(0);
    const Speed_12_8 = ref(0);
    const Speed_22_9 = ref(0);
    const Speed_22_10 = ref(0);
    const Speed_22_11 = ref(0);
    const Speed_22_12 = ref(0);
    const Speed_11_13 = ref(0);
    const Speed_11_14 = ref(0);
    const Speed_11_15 = ref(0);
    const Speed_11_16 = ref(0);
    const Speed_11_Sr = ref(0);
    const Speed_12_Sr = ref(0);
    const Speed_21_Sr = ref(0);
    const Speed_22_Sr = ref(0);

    // перепады давления
    const deltap_11_12 = ref(0);
    const deltap_11_22 = ref(0);
    const deltap_21_22 = ref(0);

    const Pressure_11 = ref(0);
    const Pressure_12 = ref(0);
    const Pressure_21 = ref(0);
    const Pressure_22 = ref(0);

    const KPD_T = ref(0);
    const KPD_H = ref(0);
    const m3h_11 = ref(0);
    const m3h_12 = ref(0);
    const m3h_21 = ref(0);
    const m3h_22 = ref(0);

    const mass_11 = ref(0);
    const mass_11_21 = ref(0);
    const mass_12 = ref(0);
    const mass_21 = ref(0);
    const mass_22 = ref(0);

    const Hc_11 = ref(0);
    const Hc_12 = ref(0);
    const Hc_21 = ref(0);
    const Hc_22 = ref(0);
    const Hc_Lab = ref(0);
    const Rh_Lab = ref(0);
    const SCo_t_nar = ref(0);
    const SCo_Rh_nar = ref(0);
    const SCo_Abs_nar = ref(0);

    const T_11 = ref(0);
    const T_12 = ref(0);
    const T_21 = ref(0);
    const T_22 = ref(0);
    const Rh_11 = ref(0);
    const Rh_12 = ref(0);
    const Rh_21 = ref(0);
    const Rh_22 = ref(0);

    const deltahum_vyt = ref(0);
    const deltahum_pr = ref(0);
    const masshum_vyt = ref(0);
    const masshum_pr = ref(0);

    const dateStart = ref('');
    const getRouteOrder = ref('');
    let npause = 0;
    const labelPause = ref('Пауза');
    const alarmsBURR = ref(false);
    function updateChart(index, value, setpoint, time, direct, update) {
      if (time) {
        charts[index].value.pushValues([{ value }], time, direct, update);
      } else {
        charts[index].value.pushValues([{ value }], getCurrentTime(), direct, update);
      }
      if (setpoint != null) {
        charts[index].value.setSetpoint(Number(setpoint).toFixed(2));
      }
    }
    function shift0() {
      if (dataValues0.length > 0) {
        const mes = dataValues0[dataValues0.length - 1];
        updateChart(0, mes.deltap_11_22, null, mes.time, false, false);
        dataValues0.pop();
        load.value = dataValues0.length;
        setImmediate(shift0);
      } else {
        charts[0].value.update();
      }
    }
    function shift1() {
      if (dataValues1.length > 0) {
        const mes = dataValues1[dataValues1.length - 1];
        updateChart(1, mes.SCo_reg_m3h_vyt_reciever, null, mes.time, false, false);
        dataValues1.pop();
        load.value = dataValues1.length;
        setImmediate(shift1);
      } else {
        charts[1].value.update();
      }
    }
    function parsebool(value) {
      if (value === '1') return 'ДА';
      return 'НЕТ';
    }
    function getcolor(value) {
      if (value === '1') return 'text-green';
      return 'text-orange';
    }
    function getcolorStatus(value) {
      if (value === true) return 'text-green';
      return 'text-red';
    }
    function convertToBinary(number) {
      let num = number;
      let binary = (num % 2).toString();
      for (; num > 1;) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
      }
      return binary;
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        console.log(mes);
        if (json.type === 'sendDataRecup') {
          // const status = mes.CodeStatus1.value;
          CodeStatus1.value = convertToBinary(mes.CodeStatus1.value).split('');
          while (CodeStatus1.value.length < 10) {
            CodeStatus1.value.unshift(Number(0));
          }
          CodeStatus1.value.reverse();
          CodeStatus2.value = convertToBinary(mes.CodeStatus2.value).split('');
          while (CodeStatus2.value.length < 14) {
            CodeStatus2.value.unshift(Number(0));
          }
          CodeStatus2.value.reverse();
          // IntCodeStatus1: (по порядку первые 10 бит)
          // Приток в режиме да/нет
          // 0 "Смешение",
          // 1 "Водяной калорифер",
          // 2 "Влажность",
          // 3 "Вентилятор",
          // 4 "Температура"
          // Вытяжка в режиме да\нет
          // 5 "Смешение",
          // 6 "Водяной калорифер",
          // 7 "Влажность",
          // 8 "Вентилятор",
          // 9 "Температура"
          // IntCodeStatus2:
          // Приток 2 в режиме да\нет:
          // 0 "Смешение",
          // 1 "Вентилятор",
          // 2 "Температура"
          // 3 - не используется
          // 4 "РежимУдПриток",
          // 5 "РежимУдВытяжка",
          // 6 "РежимРесивер",
          // 7 "ФиксРежимУдПриток",
          // 8 "ФиксРежимУдВытяжка",
          // 9 "ФиксДавлениеРесивер"
          // 10 "Т приток в режиме",
          // 11 "Вл приток в режиме",
          // 12 "Т вытяжка в режиме",
          // 13 "Вл вытяжка в режиме"
          if (dataValues0.length === 0) {
            updateChart(0, mes.deltap_11_22.value, null, mes.time, true, true);
          } else {
            const obj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in mes) {
              obj[key] = mes[key].value;
            }
            dataValues0.push(obj);
            shift0();
          }
          // обновление данных
          Patm.value = mes.Patm.value;
          T_Lab.value = mes.T_Lab.value;
          warmBalance.value = mes.Warm_balance.value;
          T_TMA1_21.value = mes.T_TMA1_21.value;
          T_TMA2_21.value = mes.T_TMA2_21.value;
          T_TMA3_21.value = mes.T_TMA3_21.value;
          T_TMA4_21.value = mes.T_TMA4_21.value;
          T_TMA5_21.value = mes.T_TMA5_21.value;
          T_TMA6_21.value = mes.T_TMA6_21.value;
          T_TMA7_12.value = mes.T_TMA7_12.value;
          T_TMA8_12.value = mes.T_TMA8_12.value;
          T_TMA9_12.value = mes.T_TMA9_12.value;
          T_TMA10_12.value = mes.T_TMA10_12.value;
          T_TMA11_12.value = mes.T_TMA11_12.value;
          T_TMA12_12.value = mes.T_TMA12_12.value;
          T_TMA13_22.value = mes.T_TMA13_22.value;
          T_TMA14_22.value = mes.T_TMA14_22.value;
          T_TMA15_22.value = mes.T_TMA15_22.value;
          T_TMA16_22.value = mes.T_TMA16_22.value;
          T_TMA17_22.value = mes.T_TMA17_22.value;
          T_TMA18_22.value = mes.T_TMA18_22.value;
          T_TMA19_11.value = mes.T_TMA19_11.value;
          T_TMA20_11.value = mes.T_TMA20_11.value;
          T_TMA21_11.value = mes.T_TMA21_11.value;
          T_TMA22_11.value = mes.T_TMA22_11.value;
          T_TMA23_11.value = mes.T_TMA23_11.value;
          T_TMA24_11.value = mes.T_TMA24_11.value;
          // Относительная влажность
          Rh_TMA1_21.value = mes.Rh_TMA1_21.value;
          Rh_TMA2_21.value = mes.Rh_TMA2_21.value;
          Rh_TMA3_21.value = mes.Rh_TMA3_21.value;
          Rh_TMA4_21.value = mes.Rh_TMA4_21.value;
          Rh_TMA5_21.value = mes.Rh_TMA5_21.value;
          Rh_TMA6_21.value = mes.Rh_TMA6_21.value;
          Rh_TMA7_12.value = mes.Rh_TMA7_12.value;
          Rh_TMA8_12.value = mes.Rh_TMA8_12.value;
          Rh_TMA9_12.value = mes.Rh_TMA9_12.value;
          Rh_TMA10_12.value = mes.Rh_TMA10_12.value;
          Rh_TMA11_12.value = mes.Rh_TMA11_12.value;
          Rh_TMA12_12.value = mes.Rh_TMA12_12.value;
          Rh_TMA13_22.value = mes.Rh_TMA13_22.value;
          Rh_TMA14_22.value = mes.Rh_TMA14_22.value;
          Rh_TMA15_22.value = mes.Rh_TMA15_22.value;
          Rh_TMA16_22.value = mes.Rh_TMA16_22.value;
          Rh_TMA17_22.value = mes.Rh_TMA17_22.value;
          Rh_TMA18_22.value = mes.Rh_TMA18_22.value;
          Rh_TMA19_11.value = mes.Rh_TMA19_11.value;
          Rh_TMA20_11.value = mes.Rh_TMA20_11.value;
          Rh_TMA21_11.value = mes.Rh_TMA21_11.value;
          Rh_TMA22_11.value = mes.Rh_TMA22_11.value;
          Rh_TMA23_11.value = mes.Rh_TMA23_11.value;
          Rh_TMA24_11.value = mes.Rh_TMA24_11.value;
          // плотность
          Plotnost_11.value = mes.Plotnost_11.value;
          Plotnost_12.value = mes.Plotnost_12.value;
          Plotnost_21.value = mes.Plotnost_21.value;
          Plotnost_22.value = mes.Plotnost_22.value;
          // скорость
          Speed_21_1.value = mes.Speed_21_1.value;
          Speed_21_2.value = mes.Speed_21_2.value;
          Speed_21_3.value = mes.Speed_21_3.value;
          Speed_21_4.value = mes.Speed_21_4.value;
          Speed_12_5.value = mes.Speed_12_5.value;
          Speed_12_6.value = mes.Speed_12_6.value;
          Speed_12_7.value = mes.Speed_12_7.value;
          Speed_12_8.value = mes.Speed_12_8.value;
          Speed_22_9.value = mes.Speed_22_9.value;
          Speed_22_10.value = mes.Speed_22_10.value;
          Speed_22_11.value = mes.Speed_22_11.value;
          Speed_22_12.value = mes.Speed_22_12.value;
          Speed_11_13.value = mes.Speed_11_13.value;
          Speed_11_14.value = mes.Speed_11_14.value;
          Speed_11_15.value = mes.Speed_11_15.value;
          Speed_11_16.value = mes.Speed_11_16.value;
          Speed_11_Sr.value = mes.Speed_11_Sr.value;
          Speed_12_Sr.value = mes.Speed_12_Sr.value;
          Speed_21_Sr.value = mes.Speed_21_Sr.value;
          Speed_22_Sr.value = mes.Speed_22_Sr.value;
          // перепад давления
          deltap_11_12.value = mes.deltap_11_12.value;
          deltap_11_22.value = mes.deltap_11_22.value;
          deltap_21_22.value = mes.deltap_21_22.value;
          // давление
          Pressure_11.value = mes.Pressure_11.value;
          Pressure_12.value = mes.Pressure_12.value;
          Pressure_21.value = mes.Pressure_21.value;
          Pressure_22.value = mes.Pressure_22.value;

          T_11.value = mes.T_11.value;
          T_12.value = mes.T_12.value;
          T_21.value = mes.T_21.value;
          T_22.value = mes.T_22.value;
          Rh_11.value = mes.Rh_11.value;
          Rh_12.value = mes.Rh_12.value;
          Rh_21.value = mes.Rh_21.value;
          Rh_22.value = mes.Rh_22.value;

          KPD_T.value = mes.KPD_T.value;
          KPD_H.value = mes.KPD_H.value;
          m3h_11.value = mes.m3h_11.value;
          m3h_12.value = mes.m3h_12.value;
          m3h_21.value = mes.m3h_21.value;
          m3h_22.value = mes.m3h_22.value;

          mass_11.value = mes.mass_11.value;
          mass_11_21.value = mes.mass_11_21.value;
          mass_12.value = mes.mass_12.value;
          mass_21.value = mes.mass_21.value;
          mass_22.value = mes.mass_22.value;

          Hc_11.value = mes.Hc_11.value;
          Hc_12.value = mes.Hc_12.value;
          Hc_21.value = mes.Hc_21.value;
          Hc_22.value = mes.Hc_22.value;
          Hc_Lab.value = mes.Hc_Lab.value;
          Rh_Lab.value = mes.Rh_Lab.value;

          masshum_pr.value = mes.masshum_pr.value;
          masshum_vyt.value = mes.masshum_vyt.value;
          deltahum_pr.value = mes.deltahum_pr.value;
          deltahum_vyt.value = mes.deltahum_vyt.value;

          loadComplete.value = true;
        } else if (json.type === 'sendAirDevices') {
          if (mes.rabota.value === 'СТОП') {
            WebSocket_Send('recup', {
              id: 2, type: 'modeWrite', value: false, timestamp: getCurrentTime(),
            });
          }
          if (dataValues1.length === 0) {
            updateChart(1, mes.SCo_reg_m3h_vyt_reciever.value, null, mes.time, true, true);
          } else {
            const obj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in mes) {
              obj[key] = mes[key].value;
            }
            dataValues1.push(obj);
            shift1();
          }
          SCo_t_nar.value = mes.SCo_t_nar.value;
          SCo_Rh_nar.value = mes.SCo_Rh_nar.value;
          SCo_Abs_nar.value = mes.SCo_Abs_nar.value;
          dateStart.value = mes.StartTimeWriteFreeze.value;
          getRouteOrder.value = `http://${host}:3001/testrecup/download/get_all_from_start/${dateStart.value}`;
          rotorSpeed.value = mes.Oborot_RR_BURR.value;
          rotorSpeedCalc.value = mes.Calc_RR_BURR.value;
          // запись
          if (mes.TextStatusWrite) {
            statusWrite.value = mes.TextStatusWrite.value;
          } else {
            statusWrite.value = 'ERROR';
          }
          statusBD.value = mes.StatusBD.value;
          // OK - зеленым цветом, connected - оранжевый
          countWrite.value = mes.Count_WritedData.value;
          countAutoWrite.value = mes.cyclic_index.value;

          if (lock_autoWrite.value > 0) {
            lock_autoWrite.value -= 1;
          } else if (!changeDialog.value) {
            autoWrite.value = mes.AutoWrite.value;
          }
          // if (lock_pause.value > 0) {
          //   lock_pause.value -= 1;
          // } else {
          // if (pause.value !== mes.SetPause.value) {
          //   WebSocket_Send('recup', {
          //     id: 2, type: 'pause', value: !pause.value, timestamp: getCurrentTime(),
          //   });
          // }
          // if (!changeDialog.value) {
          pause.value = mes.SetPause.value;
          // }
          // }
          if (lock_modeWrite.value > 0) {
            lock_modeWrite.value -= 1;
          } else if (!changeDialog.value) {
            modeWrite.value = mes.StateSwitchWrite.value;
          }
          if (!focus_countRegisterWrite.value) {
            countRegisterWrite.value = mes.SetsAutoWrite.value;
          }
        }
      }
    }
    function updateCountRegisterWrite() {
      WebSocket_Send('recup', {
        id: 2, type: 'countRegisterWrite', value: countRegisterWrite.value, timestamp: getCurrentTime(),
      });
    }
    function updateModeWrite() {
      lock_modeWrite.value = 2;
      pause.value = true;
      WebSocket_Send('recup', {
        id: 2, type: 'modeWrite', value: modeWrite.value, timestamp: getCurrentTime(),
      });
      if (modeWrite.value) {
        console.log('завершение записи');
      }
    }
    function updateAutoWrite() {
      lock_autoWrite.value = 2;
      WebSocket_Send('recup', {
        id: 2, type: 'autoWrite', value: autoWrite.value, timestamp: getCurrentTime(),
      });
    }
    function updatePause() {
      // lock_pause.value = 2;
      // WebSocket_Send('recup', {
      //   id: 2, type: 'pause', value: pause.value, timestamp: getCurrentTime(),
      // });
    }
    function send(toggle) {
      pause.value = !pause.value;
      WebSocket_Send('recup', {
        id: 2, type: 'manual', value: toggle, timestamp: getCurrentTime(),
      });
    }
    let varFunction = null;
    function enterPassword(action) {
      if (password !== TRUE_PASSWORD) {
        changeDialog.value = true;
        inputPassword.value = '';
        varFunction = action;
      } else {
        localStorage.setItem('passwordLab', password);
        action();
      }
    }
    function confirmPassword() {
      if (inputPassword.value === TRUE_PASSWORD) {
        password = inputPassword.value;
        console.log(password);
        changeDialog.value = false;
        varFunction();
      } else {
        errorPasswordDialog.value = true;
      }
    }
    onMounted(() => {
      axios
        .get(`${host}/app/database/DataRecup/720`).then((responseM) => {
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            dataValues0.push(responseM.data[index]);
          }
          shift0();
        });
      axios
        .get(`${host}/app/database/AirDevice/720`).then((responseA) => {
          for (let index = responseA.data.length - 1; index >= 0; index -= 1) {
            dataValues1.push(responseA.data[index]);
          }
          shift1();
        });

      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
      setInterval(() => {
        if (!pause.value && modeWrite.value) {
          npause += 1;
          if (npause > 1) {
            colorPause.value = 'red';
            labelPause.value = 'Запись';
            npause = 0;
          } else {
            colorPause.value = 'grey';
          }
        } else {
          npause = 0;
          labelPause.value = 'Пауза';
          colorPause.value = 'grey';
        }
      }, 500);
      const res = localStorage.getItem('workBURR');
      alarmsBURR.value = res === 'true';
      if (alarmsBURR.value) {
        // alarmMessage.value = true;
      }
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      changeDialog,
      errorPasswordDialog,
      inputPassword,
      comp_inputPassword,
      enterPassword,
      confirmPassword,
      confirmPass,
      updatePause,
      updateModeWrite,
      updateAutoWrite,
      updateCountRegisterWrite,
      Chart,
      charts,
      load,
      T_Lab,
      Patm,
      warmBalance,
      T_TMA1_21,
      T_TMA2_21,
      T_TMA3_21,
      T_TMA4_21,
      T_TMA5_21,
      T_TMA6_21,
      T_TMA7_12,
      T_TMA8_12,
      T_TMA9_12,
      T_TMA10_12,
      T_TMA11_12,
      T_TMA12_12,
      T_TMA13_22,
      T_TMA14_22,
      T_TMA15_22,
      T_TMA16_22,
      T_TMA17_22,
      T_TMA18_22,
      T_TMA19_11,
      T_TMA20_11,
      T_TMA21_11,
      T_TMA22_11,
      T_TMA23_11,
      T_TMA24_11,
      Rh_TMA1_21,
      Rh_TMA2_21,
      Rh_TMA3_21,
      Rh_TMA4_21,
      Rh_TMA5_21,
      Rh_TMA6_21,
      Rh_TMA7_12,
      Rh_TMA8_12,
      Rh_TMA9_12,
      Rh_TMA10_12,
      Rh_TMA11_12,
      Rh_TMA12_12,
      Rh_TMA13_22,
      Rh_TMA14_22,
      Rh_TMA15_22,
      Rh_TMA16_22,
      Rh_TMA17_22,
      Rh_TMA18_22,
      Rh_TMA19_11,
      Rh_TMA20_11,
      Rh_TMA21_11,
      Rh_TMA22_11,
      Rh_TMA23_11,
      Rh_TMA24_11,
      Plotnost_11,
      Plotnost_12,
      Plotnost_21,
      Plotnost_22,
      Speed_21_1,
      Speed_21_2,
      Speed_21_3,
      Speed_21_4,
      Speed_12_5,
      Speed_12_6,
      Speed_12_7,
      Speed_12_8,
      Speed_22_9,
      Speed_22_10,
      Speed_22_11,
      Speed_22_12,
      Speed_11_13,
      Speed_11_14,
      Speed_11_15,
      Speed_11_16,
      Speed_11_Sr,
      Speed_12_Sr,
      Speed_21_Sr,
      Speed_22_Sr,
      deltap_11_12,
      deltap_11_22,
      deltap_21_22,
      Pressure_11,
      Pressure_12,
      Pressure_21,
      Pressure_22,
      KPD_T,
      KPD_H,
      m3h_11,
      m3h_12,
      m3h_21,
      m3h_22,
      mass_11,
      mass_11_21,
      mass_12,
      mass_21,
      mass_22,
      Hc_11,
      Hc_12,
      Hc_21,
      Hc_22,
      Hc_Lab,
      Rh_Lab,
      SCo_t_nar,
      SCo_Rh_nar,
      SCo_Abs_nar,
      parsebool,
      getcolor,
      CodeStatus1,
      CodeStatus2,
      countRegisterWrite,
      modeWrite,
      autoWrite,
      pause,
      colorPause,
      // lock_pause,
      labelPause,
      loadComplete,
      T_11,
      T_12,
      T_21,
      T_22,
      Rh_11,
      Rh_12,
      Rh_21,
      Rh_22,
      comp_countRegisterWrite,
      focus_countRegisterWrite,
      countWrite,
      countAutoWrite,
      statusWrite,
      statusBD,
      lock_modeWrite,
      getcolorStatus,
      lock_autoWrite,
      ds: ref(() => {
        console.log(1);
      }),
      deltahum_vyt,
      deltahum_pr,
      masshum_vyt,
      masshum_pr,
      dateStart,
      getRouteOrder,
      send,
      rotorSpeed,
      rotorSpeedCalc,
      alarmsBURR,
      alarmMessage,
      position,
      host,
    };
  },
};
</script>
<style>
table,
th,
td {
  border: 1px solid rgb(100, 100, 100);
}
</style>

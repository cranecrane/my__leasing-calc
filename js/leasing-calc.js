(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // sliders
    const rangeLeasingAmount = document.getElementById('rangeLeasingAmount');
    const rangeLeasingPercent = document.getElementById('rangeLeasingPercent');
    const rangeLeasingTerm = document.getElementById('rangeLeasingTerm');

    // inputs
    const leasingAmount = document.getElementById('leasingAmount');
    const leasingPercent = document.getElementById('leasingPercent');
    const leasingTerm = document.getElementById('leasingTerm');

    //total fields
    const leasingInitialPay = document.getElementById('leasingInitialPay');
    const leasingTotalSum = document.getElementById('leasingTotalSum');
    const leasingMonthPay = document.getElementById('leasingMonthPay');

    const inputs = [leasingAmount, leasingPercent, leasingTerm];
    const submitBtn = document.getElementById('leasingSubmitBtn');

    const rangeValues = {
      'leasingAmount': [1000000, 6000000],
      'leasingPercent': [10, 60],
      'leasingTerm': [1, 60]
    };
    const normalizeValue = (num, min, max) => {
      console.log(num)
      console.log(num < min)
      console.log(num > max)
      if (num < min) num = min;
      if (num > max) num = max;
      return priceFormat.to(num);
    };
    const priceFormat = wNumb({
      decimals: 0,
      thousand: ' ',
    });


    const calcLeasing = () => {
      const rate = 0.035;

      const price = priceFormat.from(leasingAmount.value);
      const percent = priceFormat.from(leasingPercent.value) / 100;
      const term = priceFormat.from(leasingTerm.value);

      const initialPay = Math.round(price * percent);
      const monthPay = Math.round((price - initialPay) * ((rate * Math.pow((1 + rate), term)) / (Math.pow((1 + rate), term) - 1)));
      const totalSum = initialPay + term * monthPay;

      leasingInitialPay.textContent = priceFormat.to(initialPay);
      leasingTotalSum.textContent = priceFormat.to(totalSum);
      leasingMonthPay.textContent = priceFormat.to(monthPay);
    };

    inputs.forEach((el) => {
      el.addEventListener('blur', (e) => {
        const target = e.currentTarget;
        target.value = normalizeValue(Number(priceFormat.from(target.value)), ...rangeValues[target.id]);
      })
    });
    inputs.forEach((el) => {
      el.addEventListener('input', (e) => el.value = priceFormat.to(Number(el.value.replace(/[\D]+/g, ''))))
    });

    if (rangeLeasingAmount) {
      noUiSlider.create(rangeLeasingAmount, {
          start: [3300000],
          connect: 'lower',
          step: 1,
          range: {
              'min': rangeValues['leasingAmount'][0],
              'max': rangeValues['leasingAmount'][1]
          },
          format: wNumb({
            decimals: 0,
            thousand: ' ',
          }),
      });
      rangeLeasingAmount.noUiSlider.on('update', function(values) {
        leasingAmount.value = values[0];
        calcLeasing();
      });
    }

    if (rangeLeasingPercent) {
      noUiSlider.create(rangeLeasingPercent, {
          start: [30],
          connect: 'lower',
          step: 1,
          range: {
            'min': rangeValues['leasingPercent'][0],
            'max': rangeValues['leasingPercent'][1]
          }
      });
      rangeLeasingPercent.noUiSlider.on('update', function(values){
        leasingPercent.value = Math.round(values[0]);
        calcLeasing();
      });
    }

    if (rangeLeasingTerm) {
      noUiSlider.create(rangeLeasingTerm, {
          start: [60],
          connect: 'lower',
          step: 1,
          range: {
            'min': rangeValues['leasingTerm'][0],
            'max': rangeValues['leasingTerm'][1]
          }
      });
      rangeLeasingTerm.noUiSlider.on('update', function(values){
          leasingTerm.value = Math.round(values[0]);
          calcLeasing();
      })
    }

    submitBtn.addEventListener('click', async (e) => {
      const rangeSliders = document.querySelectorAll('.noUi-origin');
      const formData = {
        'car-coast': priceFormat.from(leasingAmount.value),
        'initial_payment': priceFormat.from(leasingInitialPay.textContent),
        'initial_payment_percent': priceFormat.from(leasingPercent.value),
        'lease__term': priceFormat.from(leasingTerm.value),
        'total_sum': priceFormat.from(leasingTotalSum.textContent),
        'monthly_payment_from':priceFormat.from(leasingMonthPay.textContent),
      }

      e.preventDefault();
      submitBtn.disabled = true;
      inputs.forEach((el) => el.disabled = true);
      rangeSliders.forEach((el) => el.setAttribute('disabled', true))

      const response = await fetch('https://hookb.in/eK160jgYJ6UlaRPldJ1P', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json',
        }
      });
      if (!response.ok) alert(response.message)
      submitBtn.disabled = false;
      inputs.forEach((el) => el.disabled = false);
      rangeSliders.forEach((el) => el.setAttribute('disabled', false));
    })
  });
})()

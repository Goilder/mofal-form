# Справка к форме самопроверки

Сформулируй ответ своими словами, затем раскрой раздел нужного задания и сверь ход решения. Этот сценарий также используется в [примере офлайн-формы](../examples/README.md).

<details>
<summary>Материалы для самопроверки · вариант 4</summary>

[Скачать комплект с ноутбуками для Google Colab](offline-reference.rar)

<details>
<summary>Лабораторная № 5 · Уравнение Пуассона</summary>

### Пример устного ответа

Я решал краевую задачу на квадрате. Сначала разбил его сеткой с шагом 0,25. На краях значения уже заданы, поэтому осталось найти значения в девяти внутренних точках. В этом варианте правая часть уравнения равна нулю, и разностная формула говорит, что значение в каждой внутренней точке равно среднему её четырёх соседей. Я использовал это двумя способами. Сначала записал девять уравнений и решил их одновременно. Затем задал начальное приближение и четыре раза пересчитал внутренние точки по значениям предыдущего шага. Края при этом оставались фиксированными. В центре прямой расчёт дал примерно −0,672, а после четырёх итераций получилось −0,555.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))

def show_grid(values, x, vertical, x_label, vertical_label):
    grid = pd.DataFrame(values, columns=[f"{x_label}={v:g}" for v in x])
    grid.insert(0, vertical_label, vertical)
    show_table(grid)
```

**Расчёт**

```python
a, b = 1, 1
M, N, L = 4, 4, 4
h1, h2 = a / M, b / N
x, y = h1 * np.arange(M + 1), h2 * np.arange(N + 1)
phi = x[None, :] - 3 * y[:, None]**2
g = np.zeros_like(phi)
interior = [(n, m) for n in range(1, N) for m in range(1, M)]
position = {point: i for i, point in enumerate(interior)}
matrix = np.zeros((len(interior), len(interior)))
rhs = np.empty(len(interior))
neighbors = [(0, -1, 1 / h1**2), (0, 1, 1 / h1**2),
             (-1, 0, 1 / h2**2), (1, 0, 1 / h2**2)]
diagonal = 2 / h1**2 + 2 / h2**2

for i, (n, m) in enumerate(interior):
    matrix[i, i] = -diagonal
    rhs[i] = g[n, m]
    for dn, dm, weight in neighbors:
        point = (n + dn, m + dm)
        if point in position:
            matrix[i, position[point]] = weight
        else:
            rhs[i] -= weight * phi[point]

direct = phi.copy()
direct[1:-1, 1:-1] = np.linalg.solve(matrix, rhs).reshape(N - 1, M - 1)
iterated = phi.copy()
changes = []
for _ in range(L):
    next_u = iterated.copy()
    for n, m in interior:
        next_u[n, m] = (sum(weight * iterated[n + dn, m + dm]
                            for dn, dm, weight in neighbors) + g[n, m]) / diagonal
    changes.append(np.abs(next_u - iterated).sum())
    iterated = next_u

print("uₓₓ + uᵧᵧ = 0, φ(x,y) = x − 3y²")
print(f"h₁ = {h1:g}, h₂ = {h2:g}")
print("Граничные значения φ")
boundary = phi.copy()
boundary[1:-1, 1:-1] = np.nan
show_grid(boundary, x, y, "x", "y")
print("Система (5), (6) после переноса граничных значений")
labels = [f"u({m},{n})" for n, m in interior]
show_table(pd.DataFrame(np.column_stack((matrix, rhs)), columns=[*labels, "Правая часть"], index=labels), index=True)
print("Решение системы")
show_grid(direct, x, y, "x", "y")
print("Метод простой итерации")
show_grid(iterated, x, y, "x", "y")
show_table(pd.DataFrame({"Итерация": np.arange(1, L + 1), "Сумма изменений": changes}))
```

</details>

<details>
<summary>Лабораторная № 7 · Колебания струны</summary>

### Пример устного ответа

В начале струна лежит ровно, её начальная скорость равна нулю. Дальше оба конца движутся вниз по заданным формулам. Я разбил струну по длине, а время — на четыре шага. В таблице каждая строка показывает положение струны в один момент. Сначала я заполнил значения на концах, затем по формуле (10) нашёл первый ряд внутренних точек. Каждый следующий ряд рассчитывается по двум предыдущим: используются значение в самой точке и значения её соседей. К моменту $t=1$ все точки по таблице сместились вниз. Для расчёта я взял формулу (11), как требует задание. В методичке её коэффициент при среднем узле отличается от того, который получается из формулы (7), поэтому результаты по этим двум записям различаются.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))

def show_grid(values, x, vertical, x_label, vertical_label):
    grid = pd.DataFrame(values, columns=[f"{x_label}={v:g}" for v in x])
    grid.insert(0, vertical_label, vertical)
    show_table(grid)
```

**Расчёт**

```python
a = 1.0
l, T = 1, 1
M, N = 4, 4
h, tau = l / M, T / N
x, time = h * np.arange(M + 1), tau * np.arange(N + 1)
gamma0, gamma1 = -2 * time, -time**2
phi, psi = np.zeros(M + 1), np.zeros(M + 1)
g = np.zeros((N + 1, M + 1))

u = np.zeros_like(g)
u[0, :] = phi
u[:, 0], u[:, -1] = gamma0, gamma1
curvature = (u[0, :-2] - 2 * u[0, 1:-1] + u[0, 2:]) / h**2
u[1, 1:-1] = u[0, 1:-1] + tau**2 / 2 * (a**2 * curvature + g[0, 1:-1]) + tau * psi[1:-1]
factor = a**2 * tau**2 / h**2
for n in range(1, N):
    spatial = u[n, :-2] - u[n, 1:-1] + u[n, 2:]
    u[n + 1, 1:-1] = 2 * u[n, 1:-1] - u[n - 1, 1:-1] + factor * spatial + tau**2 * g[n, 1:-1]

print("uₜₜ = a²uₓₓ, u(x,0) = uₜ(x,0) = 0, u(0,t) = −2t, u(1,t) = −t²")
print(f"a = {a:g}, h = {h:g}, τ = {tau:g}")
show_table(pd.DataFrame({"n": np.arange(N + 1), "tₙ": time, "γ₀(tₙ)": gamma0, "γ₁(tₙ)": gamma1}))
print("Сетка по формулам (10), (11)")
show_grid(u, x, time, "x", "t")
print("Начальное и конечное положение струны")
show_table(pd.DataFrame({"xₘ": x, "u(xₘ,0)": u[0], "u(xₘ,T)": u[-1]}))
print(f"Диапазон смещений при t = T: [{u[-1].min():g}, {u[-1].max():g}]")
if np.all(u[-1] < 0):
    print("Вся сеточная струна сместилась вниз, как и оба её конца.")
print("Формула (11) расходится с (7). В левом углу начальная скорость 0")
print("и скорость заданного движения конца −2 также не согласованы.")
```

</details>

<details>
<summary>Лабораторная № 16 · Метод Адамса</summary>

### Пример устного ответа

В этой задаче известно начальное значение $y(0)=1$, а формула $y'=x^2+y^2$ говорит, с какой скоростью меняется $y$. Я взял отрезок до $x=0{,}5$ и разбил его на пять шагов по 0,1. Особенность метода Адамса в том, что для нового шага он использует скорости изменения сразу в трёх последних точках. В самом начале известна только одна точка, поэтому ещё две я получил методом Эйлера. Теперь можно взять три скорости, умножить каждую на её коэффициент и сложить. Полученная сумма, умноженная на шаг, даёт прибавку к текущему $y$. Повторяя этот расчёт до конца сетки, я получил $y(0{,}5)\approx1{,}96472$.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))
```

**Расчёт**

```python
X = 0.5
x0, y0 = 0, 1
N, q = 5, 2
h = (X - x0) / N
x = x0 + h * np.arange(N + 1)

def f_adams(x, y):
    return x**2 + y**2

matrix = np.array([[(-i)**k for i in range(q + 1)] for k in range(q + 1)])
rhs = np.array([1 / (k + 1) for k in range(q + 1)])
weights = np.linalg.solve(matrix, rhs)

y = np.zeros(N + 1)
y[0] = y0
for n in range(q):
    y[n + 1] = y[n] + h * f_adams(x[n], y[n])
for n in range(q, N):
    slope = sum(weights[i] * f_adams(x[n - i], y[n - i]) for i in range(q + 1))
    y[n + 1] = y[n] + h * slope

print("y′ = x² + y², y(0) = 1")
print("Система (7) для A₀, A₁, A₂")
show_table(pd.DataFrame(np.column_stack((matrix, rhs)), columns=["A₀", "A₁", "A₂", "Правая часть"]))
print("A₀ = 23/12, A₁ = −16/12, A₂ = 5/12")
print("Схема (8)   yₙ₊₁ = yₙ + h·(23fₙ − 16fₙ₋₁ + 5fₙ₋₂)/12")
print(f"X = {X:g}, h = {h:g}")
show_table(pd.DataFrame({"n": np.arange(N + 1), "xₙ": x, "yₙ": y,
                         "Расчёт": ["Начальное условие"] + ["Эйлер"] * q + ["Адамс"] * (N - q)}))
```

</details>

<details>
<summary>Лабораторная № 17 · Метод наименьших квадратов</summary>

### Пример устного ответа

Здесь нужно построить приближённую функцию, которая соблюдает условия на концах отрезка. Я начал с $x^2$, потому что эта функция подходит к обоим условиям варианта 4. Затем добавил к ней два многочлена с неизвестными коэффициентами. Эти добавки устроены так, что граничные условия сохраняются при любых коэффициентах. Чтобы подобрать коэффициенты, я подставил получившуюся функцию в дифференциальное уравнение. Остаток после подстановки называется невязкой. Я минимизировал интеграл от её квадрата по всему отрезку. Для этого программа решила систему из двух уравнений. Получились коэффициенты примерно −0,5494 и −0,1520. После этого я вычислил значения функции в 11 точках и построил по ним график.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from numpy.polynomial import Polynomial

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))
```

**Расчёт**

```python
a, b = 0, 1
n_basis, intervals = 2, 10
x_poly = Polynomial([0, 1])
phi0 = x_poly**2
basis = [(x_poly - a)**2 * (x_poly - b)**(1 + i) for i in range(1, n_basis + 1)]

def boundary_operator(poly):
    return poly.deriv(2) + x_poly**2 * poly.deriv() + 2 * x_poly * poly

residual0 = boundary_operator(phi0)
residual_terms = [boundary_operator(poly) for poly in basis]

def integral(poly):
    antiderivative = poly.integ()
    return antiderivative(b) - antiderivative(a)

matrix = np.array([[integral(ri * rj) for rj in residual_terms] for ri in residual_terms])
rhs = np.array([-integral(residual0 * ri) for ri in residual_terms])
coefficients = np.linalg.solve(matrix, rhs)
least_squares = phi0 + sum(ci * phi for ci, phi in zip(coefficients, basis))
x_ls = a + np.arange(intervals + 1) * (b - a) / intervals
y_ls = least_squares(x_ls)

print("y″ + x²y′ + 2xy = 0, y(0) + y′(0) = 0, y(1) = 1")
print("φ₀ = x², φ₁ = x²(x − 1)², φ₂ = x²(x − 1)³")
print("Невязка R(x,C₁,C₂) = r₀(x) + C₁r₁(x) + C₂r₂(x)")
for i, term in enumerate([residual0, *residual_terms]):
    print(f"r{i}(x) = {term}")
print("Система (8) для C₁, C₂")
show_table(pd.DataFrame(np.column_stack((matrix, rhs)), columns=["C₁", "C₂", "Правая часть"]))
print(f"C₁ = {coefficients[0]:.10f}, C₂ = {coefficients[1]:.10f}")
print(f"y₂(x) = x² + ({coefficients[0]:.10f})·φ₁(x) + ({coefficients[1]:.10f})·φ₂(x)")
show_table(pd.DataFrame({"k": np.arange(intervals + 1), "xₖ": x_ls, "y₂(xₖ)": y_ls}))

plt.figure(figsize=(7, 4))
plt.plot(x_ls, y_ls, "o-", color="tab:blue")
plt.xlabel("xₖ")
plt.ylabel("y₂(xₖ)")
plt.title("Лабораторная № 17 · Метод наименьших квадратов · Вариант 4")
plt.grid(alpha=0.35)
plt.show()
```

</details>

<details>
<summary>Лабораторная № 18 · Прогонка и правило Рунге</summary>

### Пример устного ответа

Здесь я решал ту же краевую задачу, что и в № 17, теперь методом прогонки. Я заменил производные разностями между значениями в соседних точках. Получилась система, где каждое внутреннее уравнение связывает всего три соседние точки. На прямом ходе я иду слева направо и вычисляю коэффициенты, которые связывают текущую точку со следующей. На обратном ходе начинаю с известного значения $y(1)=1$ и восстанавливаю решение справа налево. Я повторил расчёт с шагами 0,2 и 0,1. Для оценки по правилу Рунге сравнил значения в одинаковых точках и разделил модуль разности на три, как указано в методичке. Отдельно сравнил результат с МНК. У левой границы расхождение большое, поскольку выбранный базис МНК там фиксирует и значение, и производную.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd
from numpy.polynomial import Polynomial

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))
```

**Многочлен МНК для сравнения**

```python
a, b = 0, 1
n_basis, intervals = 2, 10
x_poly = Polynomial([0, 1])
phi0 = x_poly**2
basis = [(x_poly - a)**2 * (x_poly - b)**(1 + i) for i in range(1, n_basis + 1)]

def boundary_operator(poly):
    return poly.deriv(2) + x_poly**2 * poly.deriv() + 2 * x_poly * poly

residual0 = boundary_operator(phi0)
residual_terms = [boundary_operator(poly) for poly in basis]

def integral(poly):
    antiderivative = poly.integ()
    return antiderivative(b) - antiderivative(a)

matrix = np.array([[integral(ri * rj) for rj in residual_terms] for ri in residual_terms])
rhs = np.array([-integral(residual0 * ri) for ri in residual_terms])
coefficients = np.linalg.solve(matrix, rhs)
least_squares = phi0 + sum(ci * phi for ci, phi in zip(coefficients, basis))
```

**Расчёт**

```python
def sweep(N):
    a, b = 0, 1
    alpha0, alpha1, A = 1, 1, 0
    beta0, beta1, B = 1, 0, 1
    h = (b - a) / N
    x = a + h * np.arange(N + 1)
    p, q, f = x**2, 2 * x, np.zeros_like(x)
    denominator = 2 + h * p[1:-1]
    m = (2 * q[1:-1] * h**2 - 4) / denominator
    t = (2 - h * p[1:-1]) / denominator
    phi = 2 * h**2 * f[1:-1] / denominator

    C = np.empty(N)
    d = np.empty(N)
    C[0] = alpha1 / (alpha0 * h - alpha1)
    d[0] = A * h / alpha1
    for k in range(1, N):
        C[k] = 1 / (m[k - 1] - t[k - 1] * C[k - 1])
        d[k] = phi[k - 1] - t[k - 1] * C[k - 1] * d[k - 1]

    y = np.empty(N + 1)
    y[N] = (B * h + beta1 * C[N - 1] * d[N - 1]) / (h * beta0 + beta1 * (1 + C[N - 1]))
    for k in range(N - 1, -1, -1):
        y[k] = C[k] * (d[k] - y[k + 1])

    return h, pd.DataFrame({
        "k": np.arange(N + 1), "xₖ": x,
        "mₖ": np.r_[np.nan, m, np.nan], "tₖ": np.r_[np.nan, t, np.nan],
        "φₖ": np.r_[np.nan, phi, np.nan], "Cₖ": np.r_[C, np.nan],
        "dₖ": np.r_[d, np.nan], "yₖ": y,
    })

N = 5
h, coarse = sweep(N)
h_half, fine = sweep(2 * N)
fine["Узел исходной сетки"] = np.where(fine["k"] % 2 == 0, "Да", "")
y_coarse = coarse["yₖ"].to_numpy()
y_fine_common = fine["yₖ"].to_numpy()[::2]
runge = np.abs(y_coarse - y_fine_common) / 3
y_ls_common = least_squares(coarse["xₖ"].to_numpy())
difference_ls = np.abs(y_coarse - y_ls_common)

print(f"Прямой и обратный ход   h = {h:g}")
show_table(coarse)
print(f"Прямой и обратный ход   h/2 = {h_half:g}")
show_table(fine)
print("Сравнение в узлах исходной сетки")
show_table(pd.DataFrame({
    "xₖ": coarse["xₖ"], "y(h)": y_coarse, "y(h/2)": y_fine_common,
    "Оценка Рунге": runge, "МНК": y_ls_common, "|y(h) − МНК|": difference_ls,
}))
print(f"Максимум оценки Рунге: {runge.max():.8g}")
print(f"Максимальное расхождение с МНК для шага h: {difference_ls.max():.8g}")
```

</details>

<details>
<summary>Тема 12 · Уравнение теплопроводности</summary>

### Пример устного ответа

В этой задаче я вычислял, как меняется температура со временем. Сначала задал начальное распределение температуры и закрепил нулевые значения на обоих концах. Дальше посчитал задачу двумя схемами на одной сетке. В явной схеме, чтобы найти температуру в новой строке таблицы, достаточно посмотреть на предыдущую строку. В неявной схеме соседние температуры в новой строке зависят друг от друга, поэтому на каждом шаге я решаю систему из трёх уравнений. По заданию я выбрал коэффициент так, чтобы критерий устойчивости явной схемы нарушался. В таблице видно, что её значения начинают резко колебаться. Например, в центре при $t=1$ явная схема дала −8,5625, а неявная — около 0,03769.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))

def show_grid(values, x, vertical, x_label, vertical_label):
    grid = pd.DataFrame(values, columns=[f"{x_label}={v:g}" for v in x])
    grid.insert(0, vertical_label, vertical)
    show_table(grid)
```

**Расчёт**

```python
a_squared = 1.0
l, T = 1, 1
N, M = 4, 4
h, tau = l / N, T / M
x, time = h * np.arange(N + 1), tau * np.arange(M + 1)
psi = x - x**2
phi = x * (x - x**2)
ratio = a_squared * tau / h**2
weight = a_squared * tau / (2 * h**2)
explicit = np.zeros((M + 1, N + 1))
implicit = np.zeros_like(explicit)
explicit[0, :] = implicit[0, :] = psi
matrix = ((1 + 2 * weight) * np.eye(N - 1)
          - weight * (np.eye(N - 1, k=1) + np.eye(N - 1, k=-1)))

new_layer_rhs = np.empty((M, N - 1))

for m in range(M):
    spatial = explicit[m, :-2] - 2 * explicit[m, 1:-1] + explicit[m, 2:]
    explicit[m + 1, 1:-1] = explicit[m, 1:-1] + weight * spatial + tau * phi[1:-1]
    rhs = implicit[m, 1:-1] + tau * phi[1:-1]
    new_layer_rhs[m] = rhs
    implicit[m + 1, 1:-1] = np.linalg.solve(matrix, rhs)

print("uₜ = a²uₓₓ + x(x − x²), u(x,0) = x − x², u(0,t) = u(1,t) = 0")
print(f"a² = {a_squared:g}, h = {h:g}, τ = {tau:g}, a²τ/h² = {ratio:g}")
print("Критерий (11) выполняется:", ratio < 0.5)
print("Матрица системы (10) на каждом новом временном слое")
show_table(pd.DataFrame(matrix, columns=["u₁", "u₂", "u₃"]))
print("Правые части системы (10) по временным слоям")
show_grid(new_layer_rhs, x[1:-1], time[1:], "x", "t")
print("Явная схема (7), (8)")
show_grid(explicit, x, time, "x", "t")
print("Неявная схема (7), (10)")
show_grid(implicit, x, time, "x", "t")
print("Сравнение при t = 1")
show_table(pd.DataFrame({
    "xₙ": x, "Явная схема": explicit[-1], "Неявная схема": implicit[-1],
    "Разность по модулю": np.abs(explicit[-1] - implicit[-1]),
}))
print("Послойные экстремумы")
show_table(pd.DataFrame({
    "tₘ": time, "Явная · min": explicit.min(axis=1), "Явная · max": explicit.max(axis=1),
    "Неявная · min": implicit.min(axis=1), "Неявная · max": implicit.max(axis=1),
}))
```

</details>

<details>
<summary>Тема 13 · Метод Ньютона</summary>

### Пример устного ответа

Мне нужно было найти такие $x$ и $y$, при которых выполняются оба уравнения. Я начал с точки $(1,1)$ и подставил её в систему. Получились две невязки, то есть два числа, показывающие, насколько уравнения далеки от выполнения. Чтобы понять, куда двигаться, я вычислил матрицу Якоби. В ней записано, как каждое уравнение меняется при небольшом изменении $x$ или $y$. По этой матрице программа решает линейную систему, находит две поправки и прибавляет их к текущим координатам. Затем всё повторяется. Я остановился, когда обе невязки по модулю стали меньше $10^{-10}$. Понадобилось пять шагов. Получилось $x\approx1{,}79993$, $y\approx0{,}58269$.

### Код для Google Colab

**Импорт и вывод таблиц**

```python
import numpy as np
import pandas as pd

def show_table(table, precision=8, index=False):
    print(table.to_string(index=index, na_rep="—", float_format=lambda value: f"{value or 0:.{precision}g}"))
```

**Расчёт**

```python
z = np.array([1.0, 1.0])
tolerance = 1e-10
max_iterations = 30

def F(z):
    x, y = z
    return np.array([np.sin(x - 1) + y - 1.3, x - np.sin(y + 1) - 0.8])

def jacobian(z):
    x, y = z
    return np.array([[np.cos(x - 1), 1], [1, -np.cos(y + 1)]])

history = []
for k in range(max_iterations + 1):
    values = F(z)
    residual = np.max(np.abs(values))
    history.append((k, *z, *values, residual))
    if residual <= tolerance or k == max_iterations:
        break
    correction = np.linalg.solve(jacobian(z), -values)
    z = z + correction

print("sin(x − 1) + y = 1,3,  x − sin(y + 1) = 0,8")
show_table(pd.DataFrame(history, columns=["k", "x", "y", "f₁", "f₂", "max(|f₁|, |f₂|)"]), precision=12)
print(f"x = {z[0]:.12f}, y = {z[1]:.12f}")
print(f"Допуск ε = {tolerance:g}, предел шагов = {max_iterations}")
print("Допуск достигнут:", residual <= tolerance)
```

</details>

</details>

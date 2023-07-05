# 在Markdown中写数学公式

## 行内插入
```latex
$公式$
```
`$a + b$`得到 $a + b$

## 行间插入
```latex
$$
公式
$$
```
```
$$
a + b
$$
```
得到
$$
a + b
$$

## 上下标
```latex
$x_1$  

$x^2$  

$x^2_1$  

$x_1^2$  

$^2x^2$  

$x_{123}$  

$x^{123}$  

$^{123}_{123}x$  

$_{def}^{abc}x^{ghi}_{jkl}$
```

$x_1$  

$x^2$  

$x^2_1$  

$x_1^2$  

$^2x^2$  

$x_{123}$  

$x^{123}$  

$^{123}_{123}x$  

$_{def}^{abc}x^{ghi}_{jkl}$

上标`^`接数据，下标`_`接数据。如果有多位数据，需要用`{}`包裹。

## 分式
`$\frac{x + y}{2}$`得到 $\frac{x + y}{2}$
```latex
\frac{}{}
```
第一个`{}`是分子，第二个`{}`是分母。

## 根式
* `$\sqrt{2}$`得到 $\sqrt{2}$  

* `$\sqrt[3]{27}$`得到 $\sqrt[3]{27}$

```latex
\sqrt[]{}
```
`{}`表示根号底下的内容，`[]`表示根号外面开几次方

## 求和
`$\sum_{k=1}^n\frac{1}{k}$`得到 $\sum_{k=1}^n\frac{1}{k}$
```latex
$$
\sum_{k=1}^n\frac{1}{k}
$$
``` 
得到： 
$$
\sum_{k=1}^n\frac{1}{k}
$$

```latex
\sum
```
在某些markdown解析器中，行内写的和行间的显示不太一致。

## 连乘
`$\prod_{i=1}^{K}$`得到 $\prod_{i=1}^{K}$

```latex
$$
\prod_{i=1}^{K}
$$
```
得到：
$$
\prod_{i=1}^{K}
$$

```latex
\prod
```

## 积分
* `$\int_a^bf(x)dx$`得到 $\int_a^bf(x)dx$   

* `$\iint_{r=1}^\infty$`得到 $\iint_{r=1}^\infty$   

* `$\iiint_1^n$`得到 $\iiint_1^n$ 


```latex
\int
\iint
\iiint
```
多重积分同样使用`\int`，通过`i`的数量表示积分导数

## 空格
```latex
紧贴 $a\!b$  
正常无空格 $ab$  
小空格 $a\,b$  
中等空格 $a\;b$  
大空格 $a\ b$  
quad空格 $a\quad b$  
两个quad空格 $a\qquad b$
```
* 紧贴 $a\!b$  
* 正常无空格 $ab$  
* 小空格 $a\,b$  
* 中等空格 $a\;b$  
* 大空格 $a\ b$  
* quad空格 $a\quad b$  
* 两个quad空格 $a\qquad b$

## 矩阵
### 无括号
```latex
$$
\begin{matrix}
1 & 2 \\
3 & 4
\end{matrix}
$$
```
$$
\begin{matrix}
1 & 2 \\
3 & 4
\end{matrix}
$$

### 小括号
```latex
$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$
```
$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$

### 中括号
```latex
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$
```
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$

### 大括号
```latex
$$
\begin{Bmatrix}
1 & 2 \\
3 & 4
\end{Bmatrix}
$$
```
$$
\begin{Bmatrix}
1 & 2 \\
3 & 4
\end{Bmatrix}
$$

### 竖线
```latex
$$
\begin{vmatrix}
1 & 2 \\
3 & 4
\end{vmatrix}
$$
```
$$
\begin{vmatrix}
1 & 2 \\
3 & 4
\end{vmatrix}
$$

### 两根竖线
```latex
$$
\begin{Vmatrix}
1 & 2 \\
3 & 4
\end{Vmatrix}
$$
```
$$
\begin{Vmatrix}
1 & 2 \\
3 & 4
\end{Vmatrix}
$$

### 自定义括号
```latex
$$
\left(
  \begin{matrix}
  1 & 2 \\
  3 & 4
  \end{matrix}
\right]
$$
```
$$
\left(
  \begin{matrix}
  1 & 2 \\
  3 & 4
  \end{matrix}
\right]
$$

### 总结 
* 使用如下格式：
```latex
$$
\begin{矩阵类型}
a & b \\
c & d \\
...
\end{矩阵类型}
$$
```
a, b, c, d...等表示矩阵内的第某个$p_{ij}$数据，`&`表示间隔元素，`\\`表示换行。

* 也可以使用另一种格式：
```latex
$$
\left左括号
\begin{matrix}
a & b \\
c & d \\
...
\end{matrix}
\right右括号
$$
```

## 分段函数
```latex
$$
y=\begin{cases}
-x,\quad x\leq 0 \\
x,\quad x>0
\end{cases}
$$
```
$$
y=\begin{cases}
-x,\quad x\leq 0 \\
x,\quad x>0
\end{cases}
$$

## 多行表达式
```latex
$$
\begin{aligned}
6 &= 1 + 5 \\
  &= 2 + 4 \\
  &= 3 + 3
\end{aligned}
$$
```
$$
\begin{aligned}
6 &= 1 + 5 \\
  &= 2 + 4 \\
  &= 3 + 3
\end{aligned}
$$

## 希腊字母
* `$\alpha$`得到 $\alpha$   
* `$\beta$`得到 $\beta$   
* `$\gamma$`的带 $\gamma$   
...

先记录到这吧，毕竟还有一大堆。

## 参考
* [MarkDown 插入数学公式实验大集合](https://juejin.cn/post/6844903554575155207)
* [markdown数学公式总结](https://zhuanlan.zhihu.com/p/357093758)
* [Markdown数学公式语法](https://www.jianshu.com/p/383e8149136c)


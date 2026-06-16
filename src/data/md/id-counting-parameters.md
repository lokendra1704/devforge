# From a perceptron to 199,210 parameters

You already know a **perceptron**: a neuron multiplies each input by a weight, adds a bias, and fires through an activation. Stack neurons into layers and you have a multi-layer perceptron (MLP). Everything that follows — intrinsic dimension, LoRA, the lot — starts by *counting* those weights and biases, because that count **is** the space the network learns in.

## How a fully connected layer counts

A fully connected (FC) layer mapping `in → out` neurons holds:

- a weight matrix of shape `in × out` → `in · out` numbers
- one bias per output neuron → `out` numbers

That's it. Memorize `in·out + out` and you can size any MLP by hand.

## Worked example: the 2–2–2 MLP

> "Two Fully Connected layers with ReLU activations and a final softmax for binary classification." — *Sahaj, Intrinsic Dimension Pt 1*

| Layer | Weights | Biases | Params |
|---|---|---|---|
| FC1 (2 → 2) | 2·2 = 4 | 2 | 6 |
| FC2 (2 → 2) | 2·2 = 4 | 2 | 6 |
| **Total** | **8** | **4** | **12** |

Twelve numbers. The network's behavior is one point in a **12-dimensional space**.

## Scaling up: MNIST, 784–200–200–10

```mermaid
flowchart LR
  I["784 in"] -->|"784·200+200<br/>= 157,000"| H1["200"]
  H1 -->|"200·200+200<br/>= 40,200"| H2["200"]
  H2 -->|"200·10+10<br/>= 2,010"| O["10 out"]
```

Add the edges: 157,000 + 40,200 + 2,010 = **n = 199,210 parameters**.

> "A classifier structured as 784–200–200–10 results in a total of n = 199,210 parameters." — *Sahaj, Pt 1*

## Why this number matters

That `n` is the **model dimension** — the number of knobs, and the dimension of the surface the optimizer walks on (the *objective landscape*). The whole surprise of this subject is that a network with 199,210 knobs does **not** need anywhere near 199,210 of them to learn the task. The next lesson measures exactly how few it needs.

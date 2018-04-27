#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Dimension por defecto de las matrices
int N, P, *A, *B, *C;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

void *multiplicacion(void *ptr);

int main(int argc, char *argv[])
{
  int i, j, k, check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 3) || ((N = atoi(argv[1])) <= 0) || ((P = atoi(argv[2])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension de la matriz (nxn X nxn)\n", argv[0]);
    printf("\nUsar: %s np\n  np: numero de threads\n", argv[0]);
    exit(1);
  }

  int ids[P];
  pthread_t threads[P];

  //Aloca memoria para las matrices
  A = (int *)malloc(sizeof(int) * N * N);
  B = (int *)malloc(sizeof(int) * N * N);
  C = (int *)malloc(sizeof(int) * N * N);
  //Inicializa las matrices A y B en 1, el resultado sera una matriz con todos sus valores en N
  for (i = 0; i < N; i++)
  {
    for (j = 0; j < N; j++)
    {
      A[i * N + j] = 1;
      B[i * N + j] = 1;
    }
  }
  //Realiza la multiplicacion

  timetick = dwalltime();
  for (int i = 0; i < P; i++)
  {
    ids[i] = i;
    pthread_create(&threads[i], NULL, multiplicacion, &ids[i]);
  }
  for (int i = 0; i < P; i++)
  {
    pthread_join(threads[i], NULL);
  }
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  //Verifica el resultado
  for (i = 0; i < N; i++)
  {
    for (j = 0; j < N; j++)
    {
      check = check && (C[i * N + j] == N);
    }
  }

  if (check)
  {
    printf("Multiplicacion de matrices resultado correcto\n");
  }
  else
  {
    printf("Multiplicacion de matrices resultado erroneo\n");
  }

  free(A);
  free(B);
  free(C);
  return (0);
}

void *multiplicacion(void *ptr)
{
  int *p, id;
  p = (int *)ptr;
  id = *p;

  int aux, i, j, k;

  for (i = ((N / P) * id); i < ((N / P) * (id + 1)); i++)
  {
    for (j = 0; j < N; j++)
    {
      aux = 0;
      for (k = 0; k < N; k++)
      {
        aux = aux + A[i * N + k] * B[k * N + j];
      }
      C[i * N + j] = aux;
    }
  }
  pthread_exit(0);
}

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Dimension por defecto de las matrices
int N;
int NUM_THREADS;
double *A, *B, *C;

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
  int i, j, k;
  int check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 3) || ((N = atoi(argv[1])) <= 0) || ((NUM_THREADS = atoi(argv[2])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension de la matriz (nxn X nxn)\n", argv[0]);
    printf("\nUsar: %s np\n  np: numero de threads\n", argv[0]);
    exit(1);
  }

  int ids[NUM_THREADS];
  pthread_attr_t attr;
  pthread_t threads[NUM_THREADS];
  pthread_attr_init(&attr);

  //Aloca memoria para las matrices
  A = (double *)malloc(sizeof(double) * N * N);
  B = (double *)malloc(sizeof(double) * N * N);
  C = (double *)malloc(sizeof(double) * N * N);
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

  for (int i = 0; i < NUM_THREADS; i++)
  {
    ids[i] = i;
    pthread_create(&threads[i], &attr, multiplicacion, &ids[i]);
  }
  printf("aca3\n");
  for (int i = 0; i < NUM_THREADS; i++)
  {
    pthread_join(threads[i], NULL);
  }
  printf("aca4\n");
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
  printf("aca5\n");
  for (i = N / NUM_THREADS * id; i < (N / (NUM_THREADS) * (id + 1)) - 1; i++)
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
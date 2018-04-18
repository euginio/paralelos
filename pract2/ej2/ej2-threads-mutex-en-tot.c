// 2. Paralelizar un algoritmo que cuente la cantidad de veces que un elemento X aparece dentro
// de un vector de N elementos enteros. Al finalizar, la cantidad de ocurrencias del elemento X
// debe quedar en una variable llamada ocurrencias. Ejecutar con 2 y 4 threads.

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Dimension por defecto de las matrices
int N, NUM_THREADS, x;
double *vector;
int tot = 0;
pthread_mutex_t tot_value_lock;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

void *num_ocurrencias(void *ptr);

int main(int argc, char *argv[])
{
  int i, j, k;
  int check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 4) || ((N = atoi(argv[1])) <= 0) || ((NUM_THREADS = atoi(argv[2])) <= 0) || ((x = atoi(argv[3])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
    printf("\nUsar: %s NUM_THREADS\n  NUM_THREADS: cantidad de hilos\n", argv[0]);
    printf("\nUsar: %s x\n  x: valor a buscar en el vector\n", argv[0]);
    exit(1);
  }

  int ids[NUM_THREADS];
  pthread_attr_t attr;
  pthread_t threads[NUM_THREADS];
  pthread_attr_init(&attr);
  pthread_mutex_init(&tot_value_lock, NULL);

  //Aloca memoria para las matrices
  vector = (double *)malloc(sizeof(double) * N);
  //Inicializa el vector con todos sus valores en 1
  for (i = 0; i < N; i++)
  {
    vector[i] = 1;
  }
  //Realiza la búsqueda
  timetick = dwalltime();
  for (int i = 0; i < NUM_THREADS; i++)
  {
    ids[i] = i;
    pthread_create(&threads[i], &attr, num_ocurrencias, &ids[i]);
  }
  for (int i = 0; i < NUM_THREADS; i++)
  {
    pthread_join(threads[i], NULL);
  }
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  printf("tot %d \n", tot);

  free(vector);
  return (0);
}

void *num_ocurrencias(void *ptr)
{
  int *p, id;
  p = (int *)ptr;
  id = *p;

  int i;
  // printf("N %d \n", N);
  // printf("NUM_THREADS %d \n", NUM_THREADS);
  // printf("id %d \n", id);

  for (i = (N / NUM_THREADS * id); i < (N / NUM_THREADS * (id + 1)); i++)
  {
    if (vector[i] == x)
    {
      pthread_mutex_lock(&tot_value_lock);
      tot = tot + 1;
      pthread_mutex_unlock(&tot_value_lock);
    }
    // printf("tot %d ", tot);
  }
  pthread_exit(0);
}
// 3. Paralelizar la búsqueda del mínimo y el máximo valor en un vector de N elementos. Ejecutar
// con 2 y 4 Threads.

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Dimension por defecto de las matrices
int N, NUM_THREADS, *vector, MIN = 999999;
pthread_mutex_t min_value_lock;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

void *min_search(void *ptr);

int main(int argc, char *argv[])
{
  int i, check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 4) || ((N = atoi(argv[1])) <= 0) || ((NUM_THREADS = atoi(argv[2])) <= 0) || ((x = atoi(argv[3])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
    printf("\nUsar: %s NUM_THREADS\n  NUM_THREADS: cantidad de hilos\n", argv[0]);
    exit(1);
  }

  int ids[NUM_THREADS];
  pthread_t threads[NUM_THREADS];
  pthread_mutex_init(&min_value_lock, NULL);

  //Aloca memoria para las matrices
  vector = (int *)malloc(sizeof(int) * N);
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
    pthread_create(&threads[i], NULL, min_search, &ids[i]);
  }
  for (int i = 0; i < NUM_THREADS; i++)
  {
    pthread_join(threads[i], NULL);
  }
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  printf("min %d \n", MIN);

  free(vector);
  return (0);
}

void *min_search(void *ptr)
{
  int *p, id;
  p = (int *)ptr;
  id = *p;

  int i, localMin = MIN;
  for (i = (N / NUM_THREADS * id); i < (N / NUM_THREADS * (id + 1)); i++)
  {
    if (vector[i] < localMin)
    {
      localMin = vector[i];
    }
  }

  pthread_mutex_lock(&min_value_lock);
  if (localMin < MIN)
  {
    MIN = localMin;
  }
  pthread_mutex_unlock(&min_value_lock);

  pthread_exit(0);
}
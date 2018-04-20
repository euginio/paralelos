// 4. Paralelizar un algoritmo que ordene un vector de N elementos por mezcla. Ejecutar con 2 y 4 Threads.

#include <stdio.h>
#include <stdlib.h>

//Dimension por defecto de las matrices
int N, P, *vector, *copia;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

int main(int argc, char *argv[])
{
  int i, check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 3) || ((N = atoi(argv[1])) <= 0) || ((P = atoi(argv[2])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
    exit(1);
  }

  //Aloca memoria para las matrices
  vector = (int *)malloc(sizeof(int) * N);
  copia = (int *)malloc(sizeof(int) * N);
  //Inicializa el vector con todos sus valores en 1
  for (i = 0; i < N; i++)
  {
    vector[i] = 1;
    copia[i] = 0;
  }
  //Realiza la búsqueda
  timetick = dwalltime();
  BottomUpMergeSort(vector, copia, N);
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  printf("prom %d \n", vector[1]);

  free(vector);
  free(copia);
  return (0);
}

// array A[] has the items to sort; array B[] is a work array
void BottomUpMergeSort(int A[], int B[],int n)
{
    // Each 1-element run in A is already "sorted".
    // Make successively longer sorted runs of length 2, 4, 8, 16... until whole array is sorted.
    for (int width = 1; width < n; width = 2 * width)
    {
        // Array A is full of runs of length width.
        for (int i = 0; i < n; i = i + 2 * width)
        {
            // Merge two runs: A[i:i+width-1] and A[i+width:i+2*width-1] to B[]
            // or copy A[i:n-1] to B[] ( if(i+width >= n) )
            BottomUpMerge(A, i, min(i+width, n), min(i+2*width, n), B);
        }
        // Now work array B is full of runs of length 2*width.
        // Copy array B to array A for next iteration.
        // A more efficient implementation would swap the roles of A and B.
        CopyArray(B, A, n);
        // Now array A is full of runs of length 2*width.
    }
}

//  Left run is A[iLeft :iRight-1].
// Right run is A[iRight:iEnd-1  ].
void BottomUpMerge(int A[], int iLeft, int iRight, int iEnd, int B[])
{
    int i = iLeft, j = iRight;
    // While there are elements in the left or right runs...
    for (int k = iLeft; k < iEnd; k++) {
        // If left run head exists and is <= existing right run head.
        if (i < iRight && (j >= iEnd || A[i] <= A[j])) {
            B[k] = A[i];
            i = i + 1;
        } else {
            B[k] = A[j];
            j = j + 1;    
        }
    } 
}

void CopyArray(int B[], int A[], int n)
{
    for(int i = 0; i < n; i++)
        A[i] = B[i];
}
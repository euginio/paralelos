#include<stdio.h>
#include<stdlib.h>
#include<omp.h>

/* El programa matrices.c realiza la multiplicación de 2 matrices cuadradas de N*N
(C=AxB).
Utilizando pragma parallel omp for Paralelizarlo de dos formas:
a. Repartiendo entre los threads el cálculo de las filas de C. Es decir, repartiendo
el trabajo del primer for.
b. Repartiendo el cálculo de las columnas de cada fila de C. Es decir, repartiendo
el trabajo del segundo for.
Comparar los tiempos de ambas soluciones variando el número de threads.*/

/* Time in seconds from some point in the past */
double dwalltime();


int main(int argc,char*argv[]){
 double *A,*B,*C;
 int i,j,k,N;
 int check=1;
 double timetick;

 //Controla los argumentos al programa
  if (argc < 3){
   printf("\n Faltan argumentos:: N dimension de la matriz, T cantidad de threads \n");
   return 0;
  }
  N=atoi(argv[1]);
  int numThreads=atoi(argv[2]);
  omp_set_num_threads(numThreads);
 
 //Aloca memoria para las matrices
  A=(double*)malloc(sizeof(double)*N*N);
  B=(double*)malloc(sizeof(double)*N*N);
  C=(double*)malloc(sizeof(double)*N*N);

 //Inicializa las matrices A y B en 1, el resultado sera una matriz con todos sus valores en N
  for(i=0;i<N;i++){
   for(j=0;j<N;j++){
	A[i*N+j]=1;
	B[i+j*N]=1;
   }
  }   

  timetick = dwalltime();
 //Realiza la multiplicacion
  #pragma omp parallel for shared(A,B,C) private(k,j) //0.29 con 512 4
  for(i=0;i<N;i++){
//    #pragma omp parallel for shared(A,B,C,i) private(k) //0.29 con 512 4
   for(j=0;j<N;j++){
    C[i*N+j]=0;
    for(k=0;k<N;k++){
	C[i*N+j]= C[i*N+j] + A[i*N+k]*B[k+j*N];
    }
   }
  }   
  printf("Tiempo en segundos %f \n", dwalltime() - timetick);

 //Verifica el resultado
  for(i=0;i<N;i++){
   for(j=0;j<N;j++){
	check=check&&(C[i*N+j]==N);
   }
  }   

  if(check){
   printf("Multiplicacion de matrices resultado correcto\n");
  }else{
   printf("Multiplicacion de matrices resultado erroneo\n");
  }
  
 //libera memoria
  free(A);
  free(B);
  free(C);
  return(0);
}



/*****************************************************************/

#include <sys/time.h>

double dwalltime()
{
	double sec;
	struct timeval tv;

	gettimeofday(&tv,NULL);
	sec = tv.tv_sec + tv.tv_usec/1000000.0;
	return sec;
}

// Es mejor paralelizar una sola vez el primer for 

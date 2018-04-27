#include <stdlib.h>
#include <time.h>
#include <stdio.h>
#include <math.h>

double dwalltime();
int reduce(double array[512], int arrayLength)
{
    if (arrayLength > 2)
    {
        arrayLength = arrayLength / 2;
        for (int i = 0; i < arrayLength; i++)
        {
            array[i] = (array[i * 2] / array[i * 2 + 1]);
        }
        return reduce(array, arrayLength);
    }
    else
    {
        return array[0] / array[1];
    }
}

int main(int argc, char *argv[])
{
#include <stdio.h>
#include <math.h>
    int N = atoi(argv[1]);
    srand(time(NULL));
    double array[N];
    //int array[8] = {256, 2, 8, 4, 32, 2, 128, 64};
    for (int j = 0; j < N; j++)
    {
        int lowerLimit = 1, upperLimit = 16;
        int r = lowerLimit + rand() % (upperLimit - lowerLimit);
        double p = 4 / 8;
        array[j] = p;
        printf("potencia...%f \n", p);
    }

    printf("resultado recursivo...\n");
    double timetick = dwalltime();
    printf("%d\n", reduce(array, 512));
    printf("Tiempo reduce recursivo en segundos %f \n", dwalltime() - timetick);

    return 0;
}

    /*****************************************************************/

#include <sys/time.h>

double dwalltime()
{
    double sec;
    struct timeval tv;

    gettimeofday(&tv, NULL);
    sec = tv.tv_sec + tv.tv_usec / 1000000.0;
    return sec;
}
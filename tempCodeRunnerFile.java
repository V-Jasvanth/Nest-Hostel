START

DECLARE integer n
DECLARE integer a ← 0, b ← 1, c
DECLARE integer i

PRINT "Enter number of terms"
READ n

IF n <= 0 THEN
    PRINT "Invalid input"
ELSE IF n == 1 THEN
    PRINT a
ELSE
    PRINT a
    PRINT b

    FOR i ← 2 TO n − 1 DO
        c ← a + b
        PRINT c
        a ← b
        b ← c
    END FOR
END IF

STOP

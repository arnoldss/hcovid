package com.hexaware.hackathon.aldia.filter;



import java.io.IOException;



import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;



@Component
public class Filter extends OncePerRequestFilter {



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
       // response.addHeader("Access-Control-Allow-Origin", "*");
       // response.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH");
       // response.addHeader("Access-Control-Allow-Credentials", "true");
       // response.addHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
        filterChain.doFilter(request, response);
    }
}
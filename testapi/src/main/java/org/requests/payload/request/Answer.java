package org.requests.payload.request;

import java.io.Serializable;
import java.util.List;

public class Answer implements Serializable {
    public int expectedStatusCode;
    public int statusCode;
    public String expectedOutput;
    public String output;
    public boolean answer;

    // Human-readable messages that explain why "answer" is false
    public List<String> messages;
}

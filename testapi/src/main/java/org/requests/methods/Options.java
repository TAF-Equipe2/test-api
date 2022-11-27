package org.requests.methods;

import org.requests.IRequest;

import java.io.Serializable;

public class Options implements IRequest {
    @Override
    public Serializable execute(String url, String input, String output, int statusCode) {
        return true;
    }
}
